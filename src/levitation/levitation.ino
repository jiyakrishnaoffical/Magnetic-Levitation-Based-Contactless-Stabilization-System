/*
 * -------------------------------------------------------------------------
 * MAGNETIC LEVITATION-BASED CONTACTLESS STABILIZATION SYSTEM 
 * -------------------------------------------------------------------------
 * Description: 
 * This program continuously polls a linear analog Hall Effect sensor to 
 * determine the distance of a neodymium magnet payload. It utilizes a 
 * custom, lightweight Proportional-Integral-Derivative (PID) algorithm to 
 * compute real-time compensations. These compensations are outputted as 
 * high-frequency PWM to a logic-level MOSFET, throttling an electromagnet 
 * to forcefully simulate anti-gravity and achieve stable mid-air suspension.
 * 
 * Target Board: Arduino Nano / Uno
 * Author: Engineered Prototype
 * -------------------------------------------------------------------------
 */

// ---------------------- PIN MAPPING ----------------------
const int hallSensorPin = A0;      // Analog input from Linear Hall Effect Sensor
const int electromagnetPin = 9;    // PWM capable output connected to MOSFET Gate

// ---------------------- PID VARIABLES --------------------
// NOTE: These values MUST be tuned manually based on your magnet weight 
// and the physical distance of your Hall Effect sensor.
double setpoint = 520;  // Target magnetic flux reading representing the "hover" sweet spot
double kp = 3.5;        // Proportional gain: How intensely the coil fights displacement
double ki = 0.5;        // Integral gain: Corrects for drooping steady-state error
double kd = 2.0;        // Derivative gain: Dampens acceleration (prevents violent bouncing)

// ------------------- SYSTEM STATE DATA -------------------
double sensorValue = 0;
double error = 0;
double previousError = 0;
double integral = 0;
double derivative = 0;
double output = 0;

void setup() {
  // Initialize Serial Monitor for system telemetry and setup calibration
  Serial.begin(115200);
  
  // Pin assignments
  pinMode(hallSensorPin, INPUT);
  pinMode(electromagnetPin, OUTPUT);
  
  // Ensure electromagnet is explicitly OFF on startup
  analogWrite(electromagnetPin, 0);

  Serial.println("System Initialized - Commencing Closed-Loop Control.");
}

void loop() {
  // 1. READ SENSOR
  // Sample linear magnetic strength. Distance is mostly inversely proportional.
  sensorValue = analogRead(hallSensorPin);
  
  // 2. CALCULATE ERROR
  // Note: Depending on magnet polarity (N or S), sensor value may increase or 
  // decrease upon approach. If system violently repels instead of stabilizing,
  // invert this math to: error = sensorValue - setpoint;
  error = setpoint - sensorValue;

  // 3. PROPORTIONAL CALCULATION (P)
  double pTerm = kp * error;

  // 4. INTEGRAL CALCULATION (I)
  integral += error;
  // Anti-windup safeguard to prevent the integral term from running away
  // if you take the magnet completely away from the system.
  integral = constrain(integral, -150, 150); 
  double iTerm = ki * integral;

  // 5. DERIVATIVE CALCULATION (D)
  derivative = error - previousError;
  double dTerm = kd * derivative;

  // 6. SUMMATION OF PID ALGORITHM
  output = pTerm + iTerm + dTerm;

  // 7. ACTUATOR LIMITING & CONVERSION
  // The Arduino PWM resolution operates strictly between 0 and 255. 
  // We clamp the computed PID output into this hardware envelope.
  int pwmValue = constrain((int)output, 0, 255);

  // 8. DRIVE MOSFET / ELECTROMAGNET
  analogWrite(electromagnetPin, pwmValue);

  // 9. TELEMETRY / DEBUG STREAM
  // Enable these prints strictly for debugging or tuning via Serial Plotter.
  // When system is deployed, disabled telemetry to maximize loop speed.
  /*
  Serial.print("Setpoint:"); Serial.print(setpoint); Serial.print(",");
  Serial.print("Sensor:"); Serial.print(sensorValue); Serial.print(",");
  Serial.print("PWM:"); Serial.println(pwmValue);
  */

  // 10. STATE STORAGE & LOOP DELAY
  previousError = error;
  
  // Micro-delay ensures PID timer consistency and smooth ADC readout.
  // Lower values yield faster loops but can introduce ADC noise jitter.
  delay(2); 
}
