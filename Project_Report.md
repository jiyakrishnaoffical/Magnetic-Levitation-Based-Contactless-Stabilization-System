# Magnetic Levitation-Based Contactless Stabilization System - Engineering Report

## 1. PROJECT OVERVIEW
### Concept
A Magnetic Levitation System uses precisely controlled electromagnetic forces to suspend an object in mid-air against gravity, without any physical support. It dynamically regulates a high-speed magnetic field based on real-time positional feedback.

### Industrial Relevance
This technology is cornerstone to modern high-tech industries:
- **Semiconductor Manufacturing:** Moving silicon wafers in cleanrooms without mechanical friction, which prevents microscopic particle contamination.
- **Pharmaceuticals:** Contactless fluid mixing and frictionless blood pumping, preventing component damage or localized heating.
- **Precision Engineering:** Active magnetic bearings in ultra-high-speed turbines and flywheels safely spinning in vacuums.

### The Simulation
Gravity continuously applies a downward force on the mass. The system perfectly generates an opposing upward magnetic force. Because the forces equal out, the net force is zero and the object floats flawlessly mid-air.

---

## 2. SYSTEM ARCHITECTURE
### Block Diagram (Signal Flow)
`[ Hall Effect Sensor ]` ➝ *(Analog Voltage)* ➝ `[ Arduino Controller ]` ➝ *(PWM Signal)* ➝ `[ MOSFET ]` ➝ *(High Current)* ➝ `[ Electromagnet ]` ➝ *(Magnetic Field)* ➝ `[ Floating Magnet / Object ]` ➝ *(Positional variation detected by Sensor)* 

### Component Roles
- **Electromagnet:** An inductive actuator that generates the upward pulling force.
- **Hall Effect Sensor:** A linear magnetic sensor that accurately measures magnetic flux density, serving as a proxy for the object’s physical distance.
- **Arduino (Microcontroller):** The brain of the operation, executing closed-loop algorithms (PID) to read the sensor and compute required coil power.
- **MOSFET:** A solid-state switch that uses low-level Arduino signals to throttle the high voltage/current required by the electromagnet.
- **Power Supply:** Provides constant 12V power with sufficient amperage (~2A) to drive the inductive coil.

---

## 3. WORKING PRINCIPLE
### The Instability of Levitation
According to **Earnshaw's Theorem**, achieving stable levitation using static, unchanging magnetic fields is mathematically impossible. A levitating object acts as an unstable equilibrium—any slight disturbance causes it to violently snap up to the electromagnet or drop to the ground. 

### PID Control to the Rescue
To counteract this instability, dynamic, high-speed adjustment is needed:
*   **Proportional (P):** Calculates how far the object is from the target anchor point. Pushes back harder the further it strays.
*   **Integral (I):** Accumulates sum of past errors to eliminate steady-state offsets (e.g., sagging due to object weight).
*   **Derivative (D):** Analyzes the *speed* at which the object moves and applies dampening. It prevents the object from painfully "bouncing" by predicting its next position.

The system loops thousands of times per second, executing micro-adjustments via Pulse Width Modulation (PWM) to stabilize the object invisibly.

---

## 4. HARDWARE REQUIREMENTS

| Component Name | Quantity | Description |
| :--- | :---: | :--- |
| **Arduino Nano / Uno** | 1 | Central microcontroller for sensor readout and PWM. |
| **12V DC Electromagnet** | 1 | Actuator to create controlled magnetic pull (~2.5kg holding force works well). |
| **Linear Hall Sensor** | 1 | (e.g., SS495A or A3144 analog). MUST be analog, not digital latch. |
| **Neodymium Magnet** | 1 | Attached to the object being suspended to interact with sensor & coil. |
| **N-Channel MOSFET** | 1 | Logic Level MOSFET (e.g., IRLZ44N, FQP30N06L). |
| **Flyback Diode** | 1 | (e.g., 1N4007) Essential to protect MOSFET from inductive spikes. |
| **Resistor (220Ω)** | 1 | Gate current limiting resistor. |
| **Resistor (10kΩ)** | 1 | Gate pull-down resistor to ensure MOSFET switches off. |
| **12V Power Supply** | 1 | DC adapter capable of safely supplying at least 2 Amps. |

---

## 5. CIRCUIT CONNECTIONS
1. **Common Ground:** Unify Arduino `GND` and 12V Power Supply `GND`.
2. **Sensor Wiring:**
   - `VCC` to Arduino `5V`
   - `GND` to Arduino `GND`
   - `Signal Out` to Arduino Analog Pin `A0`
3. **MOSFET Setup:**
   - **Gate (Pin 1):** Connect to Arduino `Pin 9` via a 220Ω resistor. Branch a 10kΩ resistor from Gate to `GND`.
   - **Source (Pin 3):** Connect directly to `GND`.
   - **Drain (Pin 2):** Connect to the electromagnet `Negative` terminal.
4. **Electromagnet & Protection:**
   - Connect electromagnet `Positive` terminal directly to `+12V`.
   - Place the **Flyback Diode** directly across the electromagnet's terminals (Cathode/stripe to +12V, Anode to Drain/Negative terminal).

---

## 6. ARDUINO CODE
*(Please see `/src/levitation/levitation.ino` workspace artifact for the heavily annotated and working C++ PID logic used in the MCU).*

---

## 7. CALIBRATION & TESTING
* **PID Tuning Sequence:**
  1. Set **Kᵢ** and **K_d** to 0. Slowly increase **Kₚ** until the object begins to aggressively oscillate under the coil.
  2. Increase **K_d** incrementally to dampen the oscillation, making the system sluggish but eliminating the shaking. 
  3. Increase **Kᵢ** slightly to correct for static dropping so the load sits perfectly at the setpoint line.
* **Common Issue:** Object slamming violently into the electromagnet.
  * *Fix:* The sensor value scaling is likely inverted. Check whether the Hall Effect signal increases or decreases as the magnet approaches, and flip your `error` calculation logic `(Setpoint - SensorValue) or (SensorValue - Setpoint)`.
* **Sensor Over-Saturation:** If the sensor sits perfectly perfectly adjacent to the electromagnet face, the coil's own field blinds it. *Fix:* Mount the sensor 2–4mm beneath the face of the electromagnet.

---

## 8. INDUSTRIAL APPLICATIONS
*   **Active Magnetic Bearings:** Huge centrifugal compressors use this technique for massive 50,000 RPM rotors, reducing mechanical friction strictly to zero resulting in minimal wear.
*   **Aseptic Handling:** In biotech, contactless systems mean zero lubricants to leak and zero surfaces grating and generating micro-contamination in final pharma solutions.

---

## 9. FUTURE IMPROVEMENTS
*   **AI-Based Stabilization:** Upgrading the linear PID with Reinforcement Learning algorithms deployed on edge hardware to dynamically self-tune to varying loads.
*   **Multi-Axis Spatial Control:** Upgrading a 1-dimensional vertical pull system to an array of 4+ coils for 3D trajectory control and absolute planar levitation.
*   **IoT & Telemetry Monitoring:** Adding an ESP32 chip to beam magnetic flux health anomalies and PID metrics directly to a real-time cloud analytics dashboard.
