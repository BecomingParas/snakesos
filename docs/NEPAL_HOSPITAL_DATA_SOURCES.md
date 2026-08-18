# NEPAL HOSPITAL DATA SOURCES FOR SNAKESOS

## Official Sources for Hospital + Antivenom Data

### 1. EDCD (Epidemiology and Disease Control Division)
**Primary Authority for Snakebite Management in Nepal**

**Website:** https://edcd.gov.np/  
**Parent:** Department of Health Services (DoHS), Ministry of Health and Population

**Key Documents:**
1. **National Guideline for Snakebite Management in Nepal**
   - Emphasizes transporting patients to hospitals where antivenom facilities exist
   - States district hospitals and higher centers have snakebite-envenoming treatment facilities
   - Source of authority for treatment protocols

2. **Standards for Establishing Snakebite Treatment Centers, 2077 (2020)**
   - Defines what constitutes a snakebite treatment center
   - Standards for facility requirements
   - Equipment and medicine requirements
   - Staff training requirements

**Data Available:**
- Official snakebite treatment center designation
- Treatment standards and protocols
- Coordination for ASVS (Anti-Snake Venom Serum) supply

**Historical Data:**
- DoHS Annual Report 2078/79 (2021/22): 88 snakebite treatment centers reported
- ASVS procurement and supply to respective centers

**Use in SnakeSOS:**
- Mark hospitals as `officialTreatmentCenter: true`
- Set `source: "EDCD"`
- Set `sourceYear: "2078/79"` (or current year if updated)
- Set `verificationStatus: "HISTORICAL"` until recently verified

---

### 2. Provincial Health Directorates
**More Recent, Province-Level Data**

Nepal has 7 provinces, each with health directorate:

#### A. Bagmati Province
**Approximate 11 Snakebite Treatment Centers (as of 2081/82):**

1. **Bharatpur Hospital** (Chitwan)
2. **Bir Hospital** (Kathmandu)
3. **Kanti Children's Hospital** (Kathmandu)
4. **TUTH (Tribhuvan University Teaching Hospital)** (Kathmandu)
5. **Patan Hospital** (Lalitpur)
6. **Sukraraj Tropical and Infectious Disease Hospital** (Kathmandu)
7. **Sindhuli District Hospital** (Sindhuli)
8. **Nepal Police Hospital, Dudhauli** (Sindhuli)
9. **Sirthauli PHC** (Sindhuli)
10. **Dudhauli PHC** (Sindhuli)
11. **Harsahi Health Post** (Sindhuli)

**Data Quality:** More current than EDCD national list  
**Use in SnakeSOS:**
- `source: "Bagmati_Provincial_Health"`
- `province: "Bagmati"`
- `verificationStatus: "HISTORICAL"` (pending direct verification)

#### B. Koshi Province
**Emergency Preparedness Document Lists:**

1. **Army Hospital, Charali** (Biratnagar)
2. **Army Hospital, Itahari** (Itahari)
3. **NRCS (Nepal Red Cross Society), Damak** (Damak)
4. **Koshi Hospital** (Biratnagar)
5. **Katari Hospital** (Udayapur)
6. **BPKIHS (BP Koirala Institute of Health Sciences)** (Dharan)
7. **Nobel Hospital** (Biratnagar)
8. **Birat Medical College** (Biratnagar)
9. **Belbari Ward No. 3 Health Facility** (Morang)
10. **Kachankawal Health Facility** (Jhapa)

**Data Quality:** From official emergency preparedness documentation  
**Use in SnakeSOS:**
- `source: "Koshi_Provincial_Health"`
- `province: "Koshi"`

#### C. Other Provinces
**Madhesh, Gandaki, Lumbini, Karnali, Sudurpaschim:**
- Provincial health directorates maintain similar lists
- Contact provincial health offices for current data
- Cross-reference with DoHS annual reports

---

### 3. Hospital Direct Verification
**Most Reliable for Current Stock Status**

**Methods:**
1. **Phone Verification**
   - Call hospital emergency/pharmacy department
   - Ask about current antivenom stock
   - Record contact person name and designation
   - Record verification timestamp

2. **Site Visit**
   - Physical verification by authorized personnel
   - Photo documentation of stock
   - Official hospital stamp/signature
   - Evidence collection

3. **Official Hospital Report**
   - Hospital provides written status report
   - Signed by authorized medical officer
   - Hospital letterhead
   - Valid for defined period

4. **Hospital Staff Portal** (Future)
   - Hospital staff update their own status
   - Requires authentication and authorization
   - Admin approval workflow

**Use in SnakeSOS:**
- `source: "Hospital_Direct"`
- `verificationType: "PHONE_CALL" | "SITE_VISIT" | "OFFICIAL_DOCUMENT" | "HOSPITAL_REPORT"`
- `verificationStatus: "VERIFIED"`
- `antivenomLastVerifiedAt: [current timestamp]`

---

## Data Collection Strategy

### Phase 1: Base Dataset (Historical)
```
EDCD National List (88 hospitals)
    ↓
Mark as HISTORICAL
Set sourceYear: "2078/79"
Set verificationStatus: "HISTORICAL"
Set antivenomStatus: "UNKNOWN"
```

### Phase 2: Provincial Enhancement
```
Provincial Health Directorate Lists
    ↓
Add/Update hospital records
Mark as province-verified
Set verificationStatus: "HISTORICAL" (until direct verification)
Update province-specific treatment centers
```

### Phase 3: Direct Verification
```
Admin Phone Verification Campaign
    ↓
Call each hospital
Update antivenomStatus based on response
Record verification details
Set verificationStatus: "VERIFIED"
Set antivenomLastVerifiedAt: [timestamp]
```

### Phase 4: Ongoing Maintenance
```
Regular Re-verification (24-hour cycle for FRESH status)
    ↓
Stale verifications trigger alerts
Admin re-verifies stale records
Hospital staff self-updates (if portal implemented)
Community reports incorrect information
```

---

## Data Structure Example

### Historical EDCD Hospital
```json
{
  "name": "Bharatpur Hospital",
  "address": "Bharatpur-10, Chitwan",
  "municipality": "Bharatpur",
  "district": "Chitwan",
  "province": "Bagmati",
  "latitude": 27.6831,
  "longitude": 84.4342,
  "phone": "056-521777",
  "snakebiteTreatmentAvailable": true,
  "antivenomStatus": "UNKNOWN",
  "source": "EDCD",
  "sourceYear": "2078/79",
  "sourceUrl": "https://edcd.gov.np/...",
  "officialTreatmentCenter": true,
  "verificationStatus": "HISTORICAL",
  "emergency24x7": true,
  "status": "ACTIVE"
}
```

### Recently Verified Hospital
```json
{
  "name": "Bharatpur Hospital",
  "address": "Bharatpur-10, Chitwan",
  "municipality": "Bharatpur",
  "district": "Chitwan",
  "province": "Bagmati",
  "latitude": 27.6831,
  "longitude": 84.4342,
  "phone": "056-521777",
  "emergencyPhone": "056-521777",
  "snakebiteTreatmentAvailable": true,
  "antivenomStatus": "AVAILABLE",
  "antivenomLastVerifiedAt": "2026-08-17T10:30:00Z",
  "antivenomVerifiedBy": "admin-user-id",
  "antivenomStockQuantity": 25,
  "antivenomStockPublic": false,
  "source": "Hospital_Direct",
  "sourceYear": "2026",
  "officialTreatmentCenter": true,
  "verificationStatus": "VERIFIED",
  "emergency24x7": true,
  "ventilatorAvailable": true,
  "icuAvailable": true,
  "status": "ACTIVE",
  "hospitalType": "GOVERNMENT"
}
```

---

## Verification Workflow

### Admin Verification Process
```
1. Admin selects hospital from "Needs Verification" list
2. Calls hospital emergency/pharmacy department
3. Asks: "What is the current antivenom stock status for snakebite treatment?"
4. Records:
   - Antivenom status (AVAILABLE/LOW_STOCK/OUT_OF_STOCK/UNKNOWN/NOT_SUPPORTED)
   - Stock quantity (if provided)
   - Contact person name
   - Contact person designation (e.g., "Emergency Dept. In-charge")
   - Contact phone number
   - Notes (any additional information)
5. Submits verification through admin dashboard
6. System records:
   - Verification timestamp
   - Verifier user ID
   - Creates HospitalVerification record
   - Updates Hospital record
7. Map updates with fresh data
```

### Verification Freshness Rules
```
FRESH:       < 24 hours (configurable)
STALE:       24 hours - 30 days
VERY_OLD:    30+ days
NEVER:       No verification record
```

---

## Data Quality Assurance

### Required for Official Treatment Center Designation
- [ ] Listed in EDCD records OR
- [ ] Listed in Provincial Health Directorate records OR
- [ ] Official hospital documentation provided

### Required for "AVAILABLE" Status
- [ ] Direct verification (phone/visit/document)
- [ ] Verification timestamp within freshness period
- [ ] Verifier ID recorded
- [ ] Contact person details recorded

### Warning Signs (Trigger Re-verification)
- Verification older than 24 hours
- Multiple user reports of incorrect information
- Hospital status changed (e.g., temporarily closed)
- Stock quantity reached LOW threshold

---

## Nepal-Specific Considerations

### Province Structure
Nepal reorganized into 7 provinces in 2015 Constitution:
1. Koshi Province
2. Madhesh Province
3. Bagmati Province
4. Gandaki Province
5. Lumbini Province
6. Karnali Province
7. Sudurpaschim Province

**District Mapping:**
- 77 districts across 7 provinces
- District hospitals are primary treatment centers
- Some districts have multiple treatment facilities

### Language Support
- Primary: Nepali
- Secondary: English
- Consider local language names in hospital records

### Contact Considerations
- Nepal country code: +977
- Phone format: Area code (2-3 digits) + number (6-7 digits)
- Example: 01-4221119 (Kathmandu), 056-521777 (Chitwan)

---

## API Integration (Future)

### National Health Management Information System (HMIS)
If Nepal's HMIS provides API access in the future:
- Real-time hospital data
- Stock levels
- Bed availability
- Emergency status

### Provincial Health Information Systems
- Province-level APIs for real-time data
- Integration with provincial emergency coordination

---

## Data Maintenance Schedule

### Daily
- Monitor verification freshness
- Alert on stale verifications
- Process user reports

### Weekly
- Review hospitals needing verification
- Contact hospitals with UNKNOWN status
- Update high-priority facilities

### Monthly
- Complete verification cycle for all treatment centers
- Update statistics
- Generate data quality report

### Quarterly
- Cross-check with provincial health directorates
- Update hospital capabilities (new equipment, services)
- Archive outdated verification records

### Annually
- Cross-check with EDCD national list
- Update from DoHS annual report
- Validate all official treatment center designations
- Clean inactive/closed hospitals

---

## Contact Information

### For Official Data Requests
- **EDCD:** edcd.mohp@gmail.com, https://edcd.gov.np/
- **DoHS:** https://dohs.gov.np/
- **Provincial Health Directorates:** Contact through provincial government websites

### For Hospital Direct Verification
- Contact individual hospitals via phone
- Request pharmacy or emergency department
- Ask for doctor-in-charge or medical superintendent for official responses

---

**Document Version:** 1.0  
**Last Updated:** August 17, 2026  
**Purpose:** Guide for collecting and maintaining Nepal hospital + antivenom data in SnakeSOS
