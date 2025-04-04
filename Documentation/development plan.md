# ElderCare Co. - Project Plan

---

## Table of Contents
1. [Persona](#persona)
2. [UX Flow](#ux-flow)
3. [Layout and Navigation](#layout-and-navigation)
4. [Color Scheme and Visual Style](#color-scheme-and-visual-style)
5. [Entity Relational Database (ERD)](#entity-relational-database-erd)
6. [Dataflow](#dataflow)

---

## 1. Persona

### Name
**ElderCare Co.**

### Background
* A caregiver or family member who is deeply invested in ensuring the well-being, safety, and comfort of elderly individuals.
* Often juggles multiple responsibilities, such as work, family, and caregiving, leading to time constraints and stress.
* Seeks efficient, reliable, and easy-to-use tools to manage elder care services, such as scheduling appointments, tracking medications, and accessing professional support.
* Values transparency, trust, and community-driven solutions to feel supported in their caregiving journey.

### Key Characteristics
* **Compassionate and Responsible**: Demonstrates a deep sense of care and accountability for the well-being of elderly individuals, often going above and beyond to ensure their comfort and safety.
* **Values Detailed, Step-by-Step Guides**: Prefers clear, actionable instructions for managing complex tasks such as medication schedules, appointment bookings, and care plan selection.
* **Seeks Community Support and Reliable Information**: Actively looks for trustworthy resources, forums, and peer support to share experiences and gain insights into elder care best practices.
* **Prefers User-Friendly and Intuitive Interfaces**: Strongly favors tools and platforms that are easy to navigate, visually clear, and require minimal learning curve, ensuring quick adoption and effective use.

---

## 2. UX Flow

### Key Pages
1. **Homepage**: 
   * Main banner with the company tagline, contact options, and navigation links.
2. **About Us**: 
   * Learn about the company’s mission, team, and story.
3. **Care Service**: 
   * Explore the range of services offered by ElderCare Co.
4. **Healthcare Professionals**: 
   * Find information about team members and their qualifications.
5. **Contact Us**: 
   * Fill out the contact form or find direct contact information.
6. **Browse Plans**: 
   * View and select care plans.
7. **Footer Navigation**: 
   * Access additional navigation links, subscription box, and contact information.

### UX Flow Diagram
```plaintext
Start
  |
  v
[Homepage]
  |
  v
[Log In] --> Access personalized features and manage account
  |
  v
[Sign Up] --> Create a new account to access services
  |
  v
[About Us] --> Learn about the company’s mission, team, and story
  |
  v
[Care Service] --> Explore the range of services offered
  |
  v
[Healthcare Professionals] --> Find information about team members and their qualifications
  |
  v
[Contact Us] --> Fill out the contact form or find direct contact information
  |
  v
[Browse Plans] --> View and select care plans
  |
  v
[Footer Navigation] --> Access additional links, subscription box, and contact information
  |
  v
End

---

## 3. Layout and Navigation

### Header
* **Contact Information**: "+63 2 1234 5678"
* **Navigation Links**: Home, About Us, Care Service, Healthcare Professionals, Contact Us, Find a Location, Browse Plans

### Main Banner
* **Text**: "Compassionate care, for those who matter most."
* **Buttons**: "Browse plans"
* **Contact Options**: 
  * Call Us: +63 2 1234 5678
  * Email Us: contact@eldercare.com
  * Visit Us: 1234 Main St, Makati, Metro Manila

### Footer
* **Subscription Box**: "Want more? Enter Email Address to Subscribe"
* **Navigation Links**: Home, About Us, Care Service, Healthcare Professionals
* **Useful Links**: Privacy Policy, Terms of Service
* **Contact Information**: 
  * Address: 1234 Main St, Makati, Metro Manila
  * Phone: +63 2 1234 5678
  * Email: contact@eldercare.com

---

## 4. Color Scheme and Visual Style

### Colors
* **Primary Colors**: Soft purples and whites to evoke calmness and trust.
* **Accent Colors**: Gentle greens and yellows to highlight important information without overwhelming the user.

### Fonts
* **Headers**: Serif font for elegance and readability.
* **Body**: Sans-serif font for clarity and modernity.

### Imagery
* Use compassionate, relatable, and high-quality images of seniors and caregivers to foster trust and empathy.

---

## 5. Entity Relational Database (ERD)

### Entities
1. **Clients**:
   * Attributes: `ClientID`, `Name`, `Age`, `Address`, `Contact Information`
   * Relationships: One-to-Many with **Appointments**, One-to-Many with **Reviews**
2. **Care Plans**:
   * Attributes: `PlanID`, `PlanName`, `Description`, `Cost`
   * Relationships: Many-to-Many with **Clients** (via **Appointments**)
3. **Appointments**:
   * Attributes: `AppointmentID`, `ClientID`, `PlanID`, `Date`, `Time`
   * Relationships: Many-to-One with **Clients**, Many-to-One with **Care Plans**, Many-to-One with **Team Members**
4. **Team Members**:
   * Attributes: `MemberID`, `Name`, `Role`, `Qualifications`, `Contact Information`
   * Relationships: One-to-Many with **Appointments**
5. **Reviews**:
   * Attributes: `ReviewID`, `ClientID`, `Rating`, `Comments`
   * Relationships: Many-to-One with **Clients**

---

## 6. Dataflow

### Client Registration
* Clients register and provide their information.
* Data is stored in the `Clients` database.

### Plan Selection
* Clients browse and select care plans.
* Selected plans are linked to the client's profile.

### Appointment Scheduling
* Clients schedule appointments with team members.
* Appointment details are stored in the `Appointments` database.

### Service Delivery
* Team members provide care services during scheduled appointments.
* Care delivery data is recorded for tracking and review purposes.

### Feedback and Reviews
* Clients provide feedback and reviews on the services received.
* Reviews are stored in the `Reviews` database and used for continuous improvement.

---

### Dataflow Summary (Text-Based Flowchart)
```plaintext
Start
  |
  v
Client Registration
  |
  v
Store Client Information in the Clients Database
  |
  v
Plan Selection
  |
  v
Link Selected Plan to Client's Profile
  |
  v
Appointment Scheduling
  |
  v
Store Appointment Details in the Appointments Database
  |
  v
Service Delivery
  |
  v
Record Care Delivery Data for Tracking and Review
  |
  v
Feedback and Reviews
  |
  v
Store Reviews in the Reviews Database
  |
  v
End
