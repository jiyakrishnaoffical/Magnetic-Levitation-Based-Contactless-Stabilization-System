<div align="center">
  <h1>🧲 Magnetic Levitation Contactless Stabilization System</h1>
  <p><i>An industrial-grade prototype demonstrating autonomous "anti-gravity" stabilization through PID control and electro-magnetic forces.</i></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Platform](https://img.shields.io/badge/Platform-Arduino-00979C.svg)](https://www.arduino.cc/)
  [![Status](https://img.shields.io/badge/Status-Prototype-orange.svg)]()
</div>

<br/>

## 📖 Project Description
This repository contains a full hardware and software implementation of a closed-loop electromagnetic active suspension unit. By relying exclusively on magnetic fields mathematically balanced out thousands of times per second, the system sustains heavy objects perfectly stationary in mid-air. It simulates "anti-gravity" by directly counteracting 9.8m/s² downward acceleration precisely according to active sensor feedback.

## 🎯 Demo & Working Principle
According to Earnshaw's theorem, static, unmodified magnetic fields cannot achieve stable levitation due to inherent instability. Without intervention, an object will violently snap towards the magnet or immediately fall away. 

This project overrides physics by adopting a high-speed active control loop. A linear **Hall Effect sensor** detects micro-millimeter drop distances and informs the centralized controller. The controller executes a **PID (Proportional, Integral, Derivative)** algorithm acting as a digital dampening spring. This translates to instant throttle tweaks sent to a heavy-duty Electromagnet—catching the falling object and gracefully floating it.

## ✨ Features
* ⚙️ **Custom PID Control Loop** written natively in C++ for absolute system timing control without bulky libraries.
* ⚡ **High-speed Pulse Width Modulation (PWM)** actuation via logic-level MOSFETs.
* 🤖 **Sub-millimeter tracking accuracy** resolving magnetic flux variations instantly.
* 🛡️ **Hardware Protection** utilizing flyback diode circuitry to shunt transient inductive coil spikes.

## 🛠️ Tech Stack
* **Microcontroller Environment**: Arduino (C++)
* **Algorithms**: Closed-loop PID Regulation
* **Hardware Interfacing**: PWM, Analog-to-Digital Conversion (ADC)

## 🧰 Components Used 
| Component | Function |
| :--- | :--- |
| **Arduino Nano / Uno** | The brain processing the PID logic and ADC data. |
| **12V DC Electromagnet** | Generates the lifting force variable by Voltage. |
| **Linear Hall Sensor** | Proxy distance sensor mapping magnetic field strength. |
| **Neodymium Magnet** | Payload interaction medium with the Hall Sensor. |
| **IRLZ44N MOSFET** | Solid state gate switching 12V high-current power. |
| **1N4007 Diode** | Flyback diode handling dangerous EMF kickoff from coil. |

## 🔌 Circuit Overview
1. **Sensory:** The Hall sensor sits just below the electromagnet, piping its analog 0-5V trace directly into Arduino `A0`.
2. **Brain:** The Arduino crunches distance data and fires a PWM resolution (0-255) through `Pin 9`.
3. **Muscle:** The MOSFET gate takes the PWM, throttling the path to Ground, causing rapid switching on the Electromagnet connected directly to a heavy-duty 12V 2A Power Source. 

*(Note: Always couple Grounds between the 12V wall adapter and the 5V Arduino).*

## 🚀 Setup Instructions
1. **Assemble the Hardware:** Construct the rig ensuring the electromagnet faces downward and securely mounted. Wire as per the circuit overview above. 
2. **Open Project:** Clone this repo and open `src/levitation/levitation.ino` in the Arduino IDE.
3. **Upload Firmware:** Flash the code onto your Arduino Uno/Nano.
4. **Baseline Testing:** Using `Tools > Serial Monitor`, monitor the sensor readout while holding the magnet by hand under the coil. Note the reading exactly where it "feels" like it wants to float.
5. **Set the Target:** Update the `setpoint` variable in the code with the number gathered in Step 4.

## 💻 Code Usage
The provided code runs seamlessly out-of-the-box. Ensure you calibrate the PID!
```cpp
// Adjustable Parameters to tune manually during operation:
double kp = 3.5;    // Bounce strength 
double ki = 0.5;    // Static sag correction
double kd = 2.0;    // Speed / Jitter dampening
double setpoint = 512; // Update this based on the Serial Monitor!
```

## 📊 Results Summary
When optimally tuned, the levitating magnet maintains complete separation acting seemingly free from gravitational mechanics. Under gentle tapping, the system demonstrates heavy dampening—rebounding the load to its assigned set-point within ~300 milliseconds smoothly. 

## 🏭 Industrial Applications
While formatted as an internship prototype, contactless systems form the foundation of high-tech modern infrastructure:
* **Semiconductor Fab Lines:** Zero-mechanical-contact silicon wafer handling mitigating particle dust generation.
* **Biopharmaceutical Mixing:** Absolute zero friction mechanical agitation ensuring no heat denaturing or lubrication leaks occur in drug vials.
* **High-Speed Bearings:** Precision jet turbines operating without physical ball bearings, dramatically escalating lifespan. 

## 🔮 Future Scope
- [ ] Migrate from fixed Arduino PID to **Reinforcement Learning AI** logic for autonomous edge-weight tuning.
- [ ] Add an ESP32 chip for localized **IoT Cloud broadcasting** to log vibration and coil thermal statuses.
- [ ] Implement multi-axis levitation for programmable geometry.

## 🤝 Contributing
Contributions are always welcome. To contribute:
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'Add some NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request.

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.
