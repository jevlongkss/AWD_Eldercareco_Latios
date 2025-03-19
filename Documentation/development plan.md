# ElderCare Co. - Project Plan

## Table of Contents
1. [Persona](#persona)
2. [UX Flow](#ux-flow)
3. [Layout and Navigation](#layout-and-navigation)
4. [Color Scheme and Visual Style](#color-scheme-and-visual-style)
5. [Entity Relational Database (ERD)](#entity-relational-database-erd)
6. [Dataflow](#dataflow)

## 1. Persona
**Name**: ElderCare Co.

**Background**:
* A caregiver or family member responsible for the well-being of elderly individuals.
* Seeks efficient ways to manage and monitor elder care services.

**Key Characteristics**:
* Compassionate and responsible
* Values detailed, step-by-step guides
* Seeks community support and reliable information
* Prefers user-friendly and intuitive interfaces

## 2. UX Flow
* **Homepage**: User lands on the homepage and can see the main banner with the company tagline, contact options, and navigation links.
* **About Us**: User navigates to the “About Us” section to learn more about the company’s mission, team, and story.
* **Care Service**: User explores the “Care Service” section to understand the range of services offered by ElderCare Co.
* **Healthcare Professionals**: User visits the “Healthcare Professionals” section to find information about the team members and their qualifications.
* **Contact Us**: User navigates to the “Contact Us” section to fill out the contact form or find direct contact information.
* **Browse Plans**: User clicks on the “Browse Plans” button to view different care plans available and select one that suits their needs.
* **Footer Navigation**: User explores the footer for additional navigation links, subscription box, and contact information.

## 3. Layout and Navigation

**Header**:
* Contact Information: "+63 2 1234 5678"
* Navigation Links: Home, About Us, Care Service, Healthcare Professionals, Contact Us, Find a Location, Browse Plans

**Main Banner**:
* Text: "Compassionate care, for those who matter most."
* Buttons: "Browse plans"
* Contact Options: Call Us: +63 2 1234 5678, Email us: contact@eldercare.com, Visit us: 1234 Main St, Makati, Metro Manila

**Our Service**:
* Text: "Wide Variety of Offers for elders"
* Subtext: "ElderCare offers compassionate, comprehensive, and daily assistance to elders, comfortably and independently."

**Statistics**:
* 100+ Elderly Clients
* 50+ Team members
* 500+ Positive reviews
* 50+ Served

**Contact Us**:
* Form Fields: Name, Email, Phone, Message
* Button: "Send Message"

**Footer**:
* Subscription Box: "Want more? Enter Email Address to Subscribe"
* Navigation Links: Home, About Us, Care Service, Healthcare Professionals
* Useful Links: Privacy Policy, Terms of Service
* Contact Information: Address: 1234 Main St, Makati, Metro Manila, Phone: +63 2 1234 5678, Email: contact@eldercare.com

## 4. Color Scheme and Visual Style
**Primary Colors**: Soft purples and whites to evoke calmness and trust.
**Accent Colors**: Gentle greens and yellows to highlight important information without overwhelming the user.

**Fonts**:
* Headers: Serif font for elegance and readability.
* Body: Sans-serif font for clarity and modernity.

**Imagery**: Use of compassionate, relatable, and high-quality images of seniors and caregivers to foster trust and empathy.

## 5. Entity Relational Database (ERD)
**Entities**:
* Clients (ClientID, Name, Age, Address, Contact Information)
* Care Plans (PlanID, PlanName, Description, Cost)
* Appointments (AppointmentID, ClientID, PlanID, Date, Time)
* Team Members (MemberID, Name, Role, Qualifications, Contact Information)
* Reviews (ReviewID, ClientID, Rating, Comments)

**Relationships**:
* One-to-many relationship between Clients and Appointments
* Many-to-many relationship between Clients and Care Plans through Appointments
* One-to-many relationship between Team Members and Appointments
* One-to-many relationship between Clients and Reviews

## 6. Dataflow

**Client Registration**:
* Clients register and provide their information.
* Data is stored in the Clients database.

**Plan Selection**:
* Clients browse and select care plans.
* Selected plans are linked to the client's profile.

**Appointment Scheduling**:
* Clients schedule appointments with team members.
* Appointment details are stored in the Appointments database.

**Service Delivery**:
* Team members provide care services during scheduled appointments.
* Care delivery data is recorded for tracking and review purposes.

**Feedback and Reviews**:
* Clients provide feedback and reviews on the services received.
* Reviews are stored in the Reviews database and used for continuous improvement.