// script.js

// --- Global Data Structures ---
// This will hold all courses, faculty, and their relationships
const fullCourseData = {
    SCORE: {
        courses: [
            { name: "Engineering Chemistry", id: "BCHY101L/P", credits: 4, type: "Theory/Lab" },
            { name: "Computer Programming: Python", id: "BCSE101E", credits: 2, type: "Theory" },
            { name: "Structured and Object-Oriented Programming", id: "BCSE102L/P", credits: 4, type: "Theory/Lab" },
            { name: "Computer Programming: Java", id: "BCSE103E", credits: 2, type: "Theory" },
            { name: "Basic Electrical and Electronics Engineering", id: "BEEE102L/P", credits: 4, type: "Theory/Lab" },
            { name: "Technical English Communication", id: "BENG101L/P", credits: 4, type: "Theory/Lab" },
            { name: "Technical Report Writing Lab", id: "BENG102P", credits: 1, type: "Lab" },
            { name: "Calculus", id: "BMAT101L/P", credits: 4, type: "Theory/Lab" },
            { name: "Differential Equations and Transforms", id: "BMAT102L", credits: 3, type: "Theory" },
            { name: "Complex Variables and Linear Algebra", id: "BMAT201L", credits: 4, type: "Theory" },
            { name: "Probability and Statistics", id: "BMAT202L/P", credits: 4, type: "Theory/Lab" },
            { name: "Engineering Physics", id: "BPHY101L/P", credits: 4, type: "Theory/Lab" },
        ],
        faculty: new Set() // Will store unique faculty names for this school
    },
    SCOPE: {
        courses: [
            { name: "Data Structures and Algorithms", id: "BCSE202L/P", credits: 4, type: "Theory/Lab" },
            { name: "Web Programming", id: "BCSE203E", credits: 3, type: "Theory" },
            { name: "Design and Analysis of Algorithms", id: "BCSE204L/P", credits: 4, type: "Theory/Lab" },
            { name: "Computer Architecture and Organization", id: "BCSE205L", credits: 3, type: "Theory" },
            { name: "Software Engineering", id: "BCSE301L/P", credits: 4, type: "Theory/Lab" },
            { name: "Database Systems", id: "BCSE302L/P", credits: 4, type: "Theory/Lab" },
            { name: "Operating Systems", id: "BCSE303L/P", credits: 4, type: "Theory/Lab" },
            { name: "Theory of Computation", id: "BCSE304L", credits: 3, type: "Theory" },
            { name: "Embedded Systems", id: "BCSE305L", credits: 3, type: "Theory" },
            { name: "Artificial Intelligence", id: "BCSE306L", credits: 3, type: "Theory" },
            { name: "Computer Networks", id: "BCSE308L/P", credits: 4, type: "Theory/Lab" },
            { name: "Cryptography and Network Security", id: "BCSE309L/P", credits: 4, type: "Theory/Lab" },
            // AI/ML Specialization Electives
            { name: "Machine Learning", id: "BCSE209L/P", credits: 4, type: "Theory/Lab" },
            { name: "Compiler Design", id: "BCSE307L/P", credits: 4, type: "Theory/Lab" },
            { name: "Deep Learning", id: "BCSE332L/P", credits: 4, type: "Theory/Lab" },
            { name: "Computer Vision", id: "BCSE407L", credits: 3, type: "Theory" },
            { name: "Natural Language Processing", id: "BCSE409L", credits: 3, type: "Theory" },
            { name: "Explainable Artificial Intelligence", id: "BCSE418L", credits: 3, type: "Theory" },
            // Discipline-linked Engineering Sciences (mapped to SCOPE if CSE-relevant)
            { name: "Discrete Mathematics and Graph Theory", id: "BMAT205L", credits: 3, type: "Theory" },
        ],
        faculty: new Set()
    },
    SENSE: {
        courses: [
            // Discipline-linked Engineering Sciences (mapped to SENSE if ECE-relevant)
            { name: "Digital Systems Design", id: "BECE102L/P", credits: 4, type: "Theory/Lab" },
            { name: "Microprocessors and Microcontrollers", id: "BECE204L/P", credits: 4, type: "Theory/Lab" },
        ],
        faculty: new Set()
    },
    SBST: { courses: [], faculty: new Set() }, // Empty for now as no courses provided
    SMEC: { courses: [], faculty: new Set() }, // Empty for now as no courses provided
    SCHEME: { courses: [], faculty: new Set() }, // Empty for now as no courses provided
    SELECT: {
        courses: [
            // Foreign Languages
            { name: "Arabic", id: "BARB101L", credits: 3, type: "Theory" },
            { name: "Chinese I", id: "BCHI101L", credits: 3, type: "Theory" },
            { name: "Spanish I", id: "BESP101L", credits: 3, type: "Theory" },
            { name: "French I", id: "BFRE101L", credits: 3, type: "Theory" },
            { name: "German I", id: "BGER101L", credits: 3, type: "Theory" },
            { name: "Modern Greek", id: "BGRE101L", credits: 3, type: "Theory" },
            { name: "Italian", id: "BITL101L", credits: 3, type: "Theory" },
            { name: "Japanese I", id: "BJAP101L", credits: 3, type: "Theory" },
            { name: "Basic Korean - Level 1", id: "BKOR101L", credits: 3, type: "Theory" },
            { name: "Basic Korean - Level 2", id: "BKOR102L", credits: 3, type: "Theory" },
            // Humanities & Social Sciences (HSM)
            { name: "Natural Disaster Mitigation and Management", id: "BCLE212L", credits: 3, type: "Theory" },
            { name: "Global Warming", id: "BCLE214L", credits: 3, type: "Theory" },
            { name: "Waste Management", id: "BCLE215L", credits: 3, type: "Theory" },
            { name: "Water Resource Management", id: "BCLE216L", credits: 3, type: "Theory" },
            { name: "Indian Classical Music", id: "BHUM102E", credits: 3, type: "Theory" },
            { name: "Micro Economics", id: "BHUM103L", credits: 3, type: "Theory" },
            { name: "Macro Economics", id: "BHUM104L", credits: 3, type: "Theory" },
            { name: "Public Policy and Administration", id: "BHUM105L", credits: 3, type: "Theory" },
            { name: "Principles of Sociology", id: "BHUM106L", credits: 3, type: "Theory" },
            { name: "Sustainability and Society", id: "BHUM107L", credits: 3, type: "Theory" },
            { name: "Urban Community Development", id: "BHUM108L", credits: 3, type: "Theory" },
            { name: "Social Work and Sustainability", id: "BHUM109L", credits: 3, type: "Theory" },
            { name: "Cognitive Psychology", id: "BHUM110E/L", credits: 3, type: "Theory" },
            { name: "Welfare Economics", id: "BHUM113L", credits: 3, type: "Theory" },
            { name: "Principles of Management", id: "BMGT101L", credits: 3, type: "Theory" },
            { name: "Human Resource Management", id: "BMGT102L", credits: 3, type: "Theory" },
            { name: "Organizational Behavior", id: "BMGT103L", credits: 3, type: "Theory" },
            { name: "Marketing Management", id: "BMGT104L", credits: 3, type: "Theory" },
            { name: "Consumer Behavior", id: "BMGT105L", credits: 3, type: "Theory" },
            { name: "Digital Marketing", id: "BMGT106L", credits: 3, type: "Theory" },
            { name: "Business Analytics", id: "BMGT107L", credits: 3, type: "Theory" },
            // Quantitative/Qualitative Skills Practice
            { name: "Quantitative Skills Practice I", id: "BSTS101P", credits: 1, type: "Practice" },
            { name: "Quantitative Skills Practice II", id: "BSTS102P", credits: 1, type: "Practice" },
            { name: "Qualitative Skills Practice I", id: "BSTS201P", credits: 1, type: "Practice" },
            { name: "Qualitative Skills Practice II", id: "BSTS202P", credits: 1, type: "Practice" },
            // Open Electives
            { name: "Happiness and Well-being", id: "BHUM111L", credits: 3, type: "Theory" },
            { name: "Forests and their Management", id: "CFOC191M", credits: 3, type: "Theory" },
            { name: "Human Behaviour", id: "CFOC406M", credits: 3, type: "Theory" },
            { name: "Conservation Economics", id: "CFOC642M", credits: 3, type: "Theory" },
            { name: "Education for Sustainable Development", id: "CFOC692M", credits: 3, type: "Theory" },
            { name: "Quantum Algorithms and Cryptography", id: "CFOC699M", credits: 3, type: "Theory" },
            { name: "Literature and Life", id: "CFOC700M", credits: 3, type: "Theory" },
            // Non-Graded Courses (Credits typically 0, but good to include for completeness)
            { name: "Environmental Sciences", id: "BCHY102N", credits: 0, type: "Non-Graded" },
            { name: "Introduction to Engineering", id: "BCSE101N", credits: 0, type: "Non-Graded" },
            { name: "Ethics and Values", id: "BHUM101N", credits: 0, type: "Non-Graded" },
            { name: "Essence of Traditional Knowledge", id: "BSSC101N", credits: 0, type: "Non-Graded" },
            { name: "Indian Constitution", id: "BSSC102N", credits: 0, type: "Non-Graded" },
        ],
        faculty: new Set()
    }
};

// Map course codes to their school (for efficient lookup from CSV)
const courseCodeToSchoolMap = {};
for (const schoolId in fullCourseData) {
    fullCourseData[schoolId].courses.forEach(course => {
        courseCodeToSchoolMap[course.id] = schoolId;
    });
}

// Stores parsed data from CSV, mapping course code to details
const courseDetailsFromCSV = {}; // { 'COURSE_CODE': [{ slot: 'A1', faculty: 'Dr. X', ... }, ...] }
const allFacultyFromCSV = new Set(); // Stores all unique faculty names
const allSlotsFromCSV = new Set(); // Stores all unique slot IDs (e.g., 'A1', 'B2')

// This is where the actual slot-to-day-time mapping will go (needs your input)
// IMPORTANT: YOU MUST POPULATE THIS MAP WITH ALL YOUR SLOTS AND THEIR TIMINGS!
const slotTimingMap = {
    // Example (YOU NEED TO PROVIDE THIS AND POPULATE IT BASED ON YOUR SLOTS):
    // Use the slots you see in your CSV's 'SLOT' column and the 'All unique slots from CSV' console log.
    // 'A1': { day: 'Mon', start: '08:00', end: '08:50', slotName: 'Monday 8:00 AM (A1)' },
    // 'B2': { day: 'Tue', start: '09:00', end: '09:50', slotName: 'Tuesday 9:00 AM (B2)' },
    // 'L1+L2': { day: 'Mon', start: '14:00', end: '15:50', slotName: 'Monday 2:00 PM - 3:50 PM (Lab)' },
    // ... continue for all your possible slots ...

    // Example based on common FFCS slots (you'll need to expand this based on your actual data)
    'A1': { day: 'Mon', start: '08:00', end: '08:50', slotName: 'Mon 8:00 AM (A1)' },
    'A2': { day: 'Wed', start: '08:00', end: '08:50', slotName: 'Wed 8:00 AM (A2)' },
    'A3': { day: 'Thu', start: '08:00', end: '08:50', slotName: 'Thu 8:00 AM (A3)' },
    'B1': { day: 'Tue', start: '09:00', end: '09:50', slotName: 'Tue 9:00 AM (B1)' },
    'B2': { day: 'Thu', start: '09:00', end: '09:50', slotName: 'Thu 9:00 AM (B2)' },
    'B3': { day: 'Fri', start: '09:00', end: '09:50', slotName: 'Fri 9:00 AM (B3)' },
    'C1': { day: 'Mon', start: '10:00', end: '10:50', slotName: 'Mon 10:00 AM (C1)' },
    'C2': { day: 'Wed', start: '10:00', end: '10:50', slotName: 'Wed 10:00 AM (C2)' },
    'C3': { day: 'Fri', start: '10:00', end: '10:50', slotName: 'Fri 10:00 AM (C3)' },
    'D1': { day: 'Tue', start: '11:00', end: '11:50', slotName: 'Tue 11:00 AM (D1)' },
    'D2': { day: 'Thu', start: '11:00', end: '11:50', slotName: 'Thu 11:00 AM (D2)' },
    'D3': { day: 'Mon', start: '11:00', end: '11:50', slotName: 'Mon 11:00 AM (D3)' },
    'E1': { day: 'Mon', start: '12:00', end: '12:50', slotName: 'Mon 12:00 PM (E1)' },
    'E2': { day: 'Wed', start: '12:00', end: '12:50', slotName: 'Wed 12:00 PM (E2)' },
    'E3': { day: 'Fri', start: '12:00', end: '12:50', slotName: 'Fri 12:00 PM (E3)' },
    'F1': { day: 'Tue', start: '13:00', end: '13:50', slotName: 'Tue 1:00 PM (F1)' },
    'F2': { day: 'Thu', start: '13:00', end: '13:50', slotName: 'Thu 1:00 PM (F2)' },
    'F3': { day: 'Wed', start: '13:00', end: '13:50', slotName: 'Wed 1:00 PM (F3)' },
    'G1': { day: 'Mon', start: '14:00', end: '14:50', slotName: 'Mon 2:00 PM (G1)' },
    'G2': { day: 'Wed', start: '14:00', end: '14:50', slotName: 'Wed 2:00 PM (G2)' },
    'G3': { day: 'Fri', start: '14:00', end: '14:50', slotName: 'Fri 2:00 PM (G3)' },
    'H1': { day: 'Tue', start: '15:00', end: '15:50', slotName: 'Tue 3:00 PM (H1)' },
    'H2': { day: 'Thu', start: '15:00', end: '15:50', slotName: 'Thu 3:00 PM (H2)' },
    'H3': { day: 'Mon', start: '15:00', end: '15:50', slotName: 'Mon 3:00 PM (H3)' },
    'A1+TA1': { day: 'Mon', start: '08:00', end: '09:50', slotName: 'Mon 8:00-9:50 AM (A1+TA1)' },
    'A2+TA2': { day: 'Wed', start: '08:00', end: '09:50', slotName: 'Wed 8:00-9:50 AM (A2+TA2)' },
    'A3+TAA': { day: 'Thu', start: '08:00', end: '09:50', slotName: 'Thu 8:00-9:50 AM (A3+TAA)' },
    'B1+TB1': { day: 'Tue', start: '09:00', end: '10:50', slotName: 'Tue 9:00-10:50 AM (B1+TB1)' },
    'B2+TB2': { day: 'Thu', start: '09:00', end: '10:50', slotName: 'Thu 9:00-10:50 AM (B2+TB2)' },
    'B3+TBB': { day: 'Fri', start: '09:00', end: '10:50', slotName: 'Fri 9:00-10:50 AM (B3+TBB)' },
    'C1+TC1': { day: 'Mon', start: '10:00', end: '11:50', slotName: 'Mon 10:00-11:50 AM (C1+TC1)' },
    'C2+TC2': { day: 'Wed', start: '10:00', end: '11:50', slotName: 'Wed 10:00-11:50 AM (C2+TC2)' },
    'C3+TCC': { day: 'Fri', start: '10:00', end: '11:50', slotName: 'Fri 10:00-11:50 AM (C3+TCC)' },
    // Lab slots (common combos)
    'L1+L2': { day: 'Mon', start: '14:00', end: '15:50', slotName: 'Mon 2:00-3:50 PM (L1+L2 Lab)' },
    'L3+L4': { day: 'Tue', start: '14:00', end: '15:50', slotName: 'Tue 2:00-3:50 PM (L3+L4 Lab)' },
    'L5+L6': { day: 'Wed', start: '14:00', end: '15:50', slotName: 'Wed 2:00-3:50 PM (L5+L6 Lab)' },
    'L7+L8': { day: 'Thu', start: '14:00', end: '15:50', slotName: 'Thu 2:00-3:50 PM (L7+L8 Lab)' },
    'L9+L10': { day: 'Fri', start: '14:00', end: '15:50', slotName: 'Fri 2:00-3:50 PM (L9+L10 Lab)' },
    'L11+L12': { day: 'Mon', start: '16:00', end: '17:50', slotName: 'Mon 4:00-5:50 PM (L11+L12 Lab)' },
    // Add single lab slots if they exist and are relevant (e.g., L1, L2, etc.)
    'L1': { day: 'Mon', start: '14:00', end: '14:50', slotName: 'Mon 2:00 PM (L1)' },
    'L2': { day: 'Mon', start: '15:00', end: '15:50', slotName: 'Mon 3:00 PM (L2)' },
    // You must review your specific CSV's 'SLOT' column and extend this map accordingly!
};

// --- Element References (keep these as they are) ---
const schoolSelect = document.getElementById('school-select');
const courseSelect = document.getElementById('course-select');
const slotSelect = document.getElementById('slot-select');
const facultySelect = document.getElementById('faculty-select');
const addCourseBtn = document.getElementById('add-course-btn');
const errorMessage = document.getElementById('error-message'); // For overlap messages
const totalCreditsSpan = document.getElementById('total-credits');
const timetableTableBody = document.getElementById('timetable-table-body');
const slotFacultySection = document.getElementById('slot-faculty-section'); // The div containing slot & faculty dropdowns
const advancedViewBtn = document.getElementById('advanced-view-btn');
const advancedViewModal = document.getElementById('advanced-view-modal');
const closeAdvancedModalBtn = document.getElementById('close-advanced-modal');
const advancedTimetableDetails = document.getElementById('advanced-timetable-details');
const themeToggleBtn = document.getElementById('theme-toggle');
const campusSelect = document.getElementById('campus-select'); // Reference to campus dropdown

// --- Timetable State ---
let userTimetable = []; // Stores courses added by the user
let currentTotalCredits = 0; // Tracks total credits for added courses

// --- Helper Functions ---

// Function to fetch and parse CSV data (ENHANCED FOR DIAGNOSTICS)
async function loadCSVData() {
    try {
        const csvFilePath = 'ALL_ALLOCATION_COMPLETE .csv'; 
        console.log(`Attempting to fetch CSV from: ${csvFilePath}`);

        const response = await fetch('ALL_ALLOCATION_COMPLETE .csv'); 
        console.log('Fetch API response status:', response.status, response.statusText);
        console.log('Fetch response object:', response); // Log the entire response object for inspection

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} (${response.statusText}) while fetching '${csvFilePath}'. Please ensure the file exists at this location relative to your HTML file and that your local server (if used) is configured correctly.`);
        }

        const text = await response.text();
        if (!text || text.trim().length === 0) {
            throw new Error("CSV file fetched successfully but it is empty or contains only whitespace.");
        }
        console.log('CSV content fetched (first 200 chars):', text.substring(0, 200) + (text.length > 200 ? '...' : ''));

        const rows = text.split('\n').map(row => row.trim()).filter(row => row.length > 0);

        if (rows.length === 0) {
            throw new Error("CSV file is empty or contains no valid data rows after initial processing.");
        }

        // Trim headers to remove BOM and extra spaces
        const headers = rows[0].split(',').map(header => header.trim());
        // Handle BOM: if the first header starts with '﻿', remove it
        if (headers[0].charCodeAt(0) === 65279) { // 65279 is the character code for BOM
            headers[0] = headers[0].substring(1);
        }

        if (headers.length === 0 || headers.every(h => h === "")) {
            console.error("Problematic headers found:", headers);
            throw new Error("CSV file headers row is empty, malformed, or not comma-separated. Check CSV integrity.");
        }
        console.log("CSV Headers:", headers);

        // Clear previous CSV data if any (e.g., on a hot reload scenario)
        Object.keys(courseDetailsFromCSV).forEach(key => delete courseDetailsFromCSV[key]);
        allFacultyFromCSV.clear();
        allSlotsFromCSV.clear();

        for (let i = 1; i < rows.length; i++) {
            const values = rows[i].split(',').map(value => value.trim());
            if (values.length !== headers.length) {
                console.warn(`Skipping malformed row ${i + 1}: Expected ${headers.length} columns, but found ${values.length}. Content: "${rows[i]}"`);
                continue; // Skip malformed rows
            }

            const rowData = {};
            headers.forEach((header, index) => {
                rowData[header] = values[index];
            });

            // --- CRITICAL CHANGES HERE BASED ON YOUR CONSOLE OUTPUT ---
            // Using the exact header names found in your console output:
            const courseCode = rowData['COURSE CODE']; // Now, headers[0] should be "COURSE CODE" after BOM removal
            const facultyName = rowData['EMP NAME'];   // Use 'EMP NAME' as found in your CSV
            const slot = rowData['SLOT'];
            const courseTitle = rowData['COURSE TITLE'];

            if (courseCode && facultyName && slot) { // Ensure essential fields are present
                if (!courseDetailsFromCSV[courseCode]) {
                    courseDetailsFromCSV[courseCode] = [];
                }
                courseDetailsFromCSV[courseCode].push({
                    slotId: slot,
                    facultyName: facultyName,
                    courseTitle: courseTitle,
                    venue: rowData['VENUE'] || "Academic Block - TBA", // Using 'VENUE' from CSV
                });

                if (facultyName && facultyName !== 'NIL') { // Check for truthiness and 'NIL'
                    allFacultyFromCSV.add(facultyName);
                }
                if (slot && slot !== 'NIL') { // Check for truthiness and 'NIL'
                    allSlotsFromCSV.add(slot);
                }
            } else {
                console.warn(`Skipping row ${i + 1} due to missing 'COURSE CODE', 'EMP NAME', or 'SLOT'. Data:`, rowData);
            }
        }

        // After parsing, populate faculty sets for each school
        for (const schoolId in fullCourseData) {
            fullCourseData[schoolId].faculty.clear(); // Clear previous faculty if any
        }

        for (const courseCode in courseDetailsFromCSV) {
            const schoolId = courseCodeToSchoolMap[courseCode];
            if (schoolId && fullCourseData[schoolId]) {
                courseDetailsFromCSV[courseCode].forEach(detail => {
                    if (detail.facultyName && detail.facultyName !== 'NIL') {
                        fullCourseData[schoolId].faculty.add(detail.facultyName);
                    }
                });
            }
        }

        console.log("CSV Data loaded and processed. Course Details from CSV:", courseDetailsFromCSV);
        console.log("All unique faculty from CSV:", Array.from(allFacultyFromCSV).sort());
        console.log("All unique slots from CSV:", Array.from(allSlotsFromCSV).sort());
        console.log("Full Course Data (with faculty sets populated from CSV):", fullCourseData);

        initializeForm(); // Initialize form after data is loaded

    } catch (error) {
        console.error("----------------------------------------");
        console.error("CRITICAL ERROR in loadCSVData function:", error);
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        if (error.stack) {
            console.error("Error Stack:", error.stack);
        }
        console.error("----------------------------------------");
        alert(`Failed to load or process course data. Please check the browser console (F12) for detailed error messages. Common issues: CSV file not found, incorrect CSV format, or network problems. (Error: ${error.message})`);
    }
}


function populateDropdown(dropdownElement, items, placeholderText, valueKey = 'id', textKey = 'name') {
    dropdownElement.innerHTML = `<option value="">${placeholderText}</option>`;
    if (Array.isArray(items)) {
        items.forEach(item => {
            const option = document.createElement('option');
            if (typeof item === 'object' && item !== null && valueKey in item && textKey in item) {
                option.value = item[valueKey];
                option.textContent = item[textKey];
                dropdownElement.appendChild(option);
            } else if (typeof item === 'string') {
                option.value = item;
                option.textContent = item;
                dropdownElement.appendChild(option);
            }
        });
    }
    dropdownElement.disabled = items.length === 0;
}


function resetAndDisableDropdown(dropdownElement, placeholderText) {
    dropdownElement.innerHTML = `<option value="">${placeholderText}</option>`;
    dropdownElement.disabled = true;
    dropdownElement.value = "";
}

function hideErrorMessage() {
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';
}

function showErrorMessage(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}


// --- Event Listeners ---

// Initialize form elements and event listeners after data is loaded
function initializeForm() {
    hideErrorMessage();

    schoolSelect.addEventListener('change', () => {
        const selectedSchoolId = schoolSelect.value;
        hideErrorMessage();

        resetAndDisableDropdown(courseSelect, 'Select Subject...');
        resetAndDisableDropdown(slotSelect, 'Select Slot...');
        resetAndDisableDropdown(facultySelect, 'Select Faculty...');
        addCourseBtn.disabled = true;

        if (selectedSchoolId && fullCourseData[selectedSchoolId]) {
            const courses = fullCourseData[selectedSchoolId].courses.slice().sort((a, b) => a.name.localeCompare(b.name));
            populateDropdown(courseSelect, courses, 'Select Subject...', 'id', 'name');
        }
    });

    courseSelect.addEventListener('change', () => {
        const selectedCourseCode = courseSelect.value;
        hideErrorMessage();

        resetAndDisableDropdown(slotSelect, 'Select Slot...');
        resetAndDisableDropdown(facultySelect, 'Select Faculty...');
        addCourseBtn.disabled = true;

        if (selectedCourseCode && courseDetailsFromCSV[selectedCourseCode]) {
            const availableSlotsForCourse = [...new Set(courseDetailsFromCSV[selectedCourseCode]
                .filter(detail => detail.slotId && detail.slotId !== 'NIL')
                .map(detail => detail.slotId)
            )].sort().map(slotId => ({ id: slotId, name: slotId }));

            populateDropdown(slotSelect, availableSlotsForCourse, 'Select Slot...', 'id', 'name');

            const facultyForCourse = [...new Set(courseDetailsFromCSV[selectedCourseCode]
                .filter(detail => detail.facultyName && detail.facultyName !== 'NIL')
                .map(detail => detail.facultyName)
            )].sort().map(facultyName => ({ id: facultyName, name: facultyName }));

            populateDropdown(facultySelect, facultyForCourse, 'Select Faculty...', 'id', 'name');
        }
    });

    slotSelect.addEventListener('change', () => {
        checkFormValidity();
        hideErrorMessage();
    });

    facultySelect.addEventListener('change', () => {
        checkFormValidity();
        hideErrorMessage();
    });

    // Theme Toggle
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        if (document.documentElement.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    }

    // Advanced View Modal Toggle
    advancedViewBtn.addEventListener('click', () => {
        advancedViewModal.classList.remove('hidden');
        updateAdvancedTimetableDetails();
    });

    closeAdvancedModalBtn.addEventListener('click', () => {
        advancedViewModal.classList.add('hidden');
    });

    advancedViewModal.addEventListener('click', (e) => {
        if (e.target === advancedViewModal) {
            advancedViewModal.classList.add('hidden');
        }
    });
}

// --- Form Validation and Submission ---

function checkFormValidity() {
    if (schoolSelect.value && courseSelect.value && slotSelect.value && facultySelect.value) {
        addCourseBtn.disabled = false;
    } else {
        addCourseBtn.disabled = true;
    }
}

// Function to check for overlaps (refined with FFCS slots)
function hasOverlap(newCourseEntry, existingTimetable) {
    const newSlotId = newCourseEntry.slot.id;
    const newSlotDetails = slotTimingMap[newSlotId]; // CRITICAL: slotTimingMap must be populated!

    if (!newSlotDetails) {
        console.warn(`Overlap check: Slot timing details not found for slot ID: ${newSlotId}. Assuming no overlap as a fallback, but this is not ideal. Please ensure slotTimingMap is complete.`);
        return false; // Fallback: Allow if timing data is missing, but log a warning.
    }

    const newStart = newSlotDetails.start;
    const newEnd = newSlotDetails.end;
    const newDay = newSlotDetails.day;

    for (const existingEntry of existingTimetable) {
        const existingSlotDetails = slotTimingMap[existingEntry.slot.id];

        if (!existingSlotDetails) {
            console.warn(`Overlap check: Slot timing details not found for existing slot ID: ${existingEntry.slot.id}. Skipping this entry for overlap comparison.`);
            continue;
        }

        const existingStart = existingSlotDetails.start;
        const existingEnd = existingSlotDetails.end;
        const existingDay = existingSlotDetails.day;

        if (newDay === existingDay) {
            if (newStart < existingEnd && existingStart < newEnd) {
                console.log("Overlap detected with:", existingEntry);
                return true;
            }
        }
    }
    return false;
}

// --- Add Course Logic ---
addCourseBtn.addEventListener('click', (event) => {
    event.preventDefault();
    hideErrorMessage();

    const selectedSchoolId = schoolSelect.value;
    const selectedCourseCode = courseSelect.value;
    const selectedSlotId = slotSelect.value;
    const selectedFacultyName = facultySelect.value;

    const courseStaticData = fullCourseData[selectedSchoolId]?.courses.find(c => c.id === selectedCourseCode);

    const courseOfferingDetails = courseDetailsFromCSV[selectedCourseCode]?.find(
        offering => offering.slotId === selectedSlotId && offering.facultyName === selectedFacultyName
    );

    const courseDisplayName = courseOfferingDetails?.courseTitle || courseStaticData?.name || "Unknown Course";
    const courseCredits = courseStaticData?.credits === undefined ? 0 : courseStaticData.credits;

    if (!courseStaticData) {
        showErrorMessage("Error: Could not find static course data. Please re-select.");
        console.error("Add course error: Static data for course code", selectedCourseCode, "in school", selectedSchoolId, "not found.");
        return;
    }

    const slotDetailsFromMap = slotTimingMap[selectedSlotId];

    if (!slotDetailsFromMap) {
        showErrorMessage(`Slot details for '${selectedSlotId}' are not defined in slotTimingMap. Cannot add course. Please contact admin or check configuration.`);
        console.error(`Error: Slot timing details not found for slot ID: ${selectedSlotId} in slotTimingMap. This map needs to be populated with all valid slots and their timings.`);
        return;
    }

    const newCourseEntry = {
        schoolId: selectedSchoolId,
        schoolName: schoolSelect.options[schoolSelect.selectedIndex].text,
        courseCode: selectedCourseCode,
        courseName: courseDisplayName,
        credits: courseCredits,
        slot: {
            id: selectedSlotId,
            name: slotDetailsFromMap.slotName || selectedSlotId,
            day: slotDetailsFromMap.day,
            start: slotDetailsFromMap.start,
            end: slotDetailsFromMap.end,
        },
        facultyName: selectedFacultyName,
        venue: courseOfferingDetails?.venue || "Academic Block - TBA"
    };

    if (hasOverlap(newCourseEntry, userTimetable)) {
        showErrorMessage(`SLOT CLASH: '${newCourseEntry.slot.name}' for ${newCourseEntry.courseName} overlaps with an existing course in your timetable!`);
        console.warn("Overlap detected. Course not added:", newCourseEntry);
        return;
    }

    userTimetable.push(newCourseEntry);
    currentTotalCredits += newCourseEntry.credits;

    console.log("Course added. Current Timetable:", userTimetable);
    console.log("Total Credits:", currentTotalCredits);

    updateTimetableDisplay();
    updateTotalCreditsDisplay();
    updateAdvancedTimetableDetails();

    resetAndDisableDropdown(courseSelect, 'Select Subject...');
    resetAndDisableDropdown(slotSelect, 'Select Slot...');
    resetAndDisableDropdown(facultySelect, 'Select Faculty...');
    addCourseBtn.disabled = true;
    if (selectedSchoolId) schoolSelect.value = selectedSchoolId;
});


// --- Display Updates ---

function updateTimetableDisplay() {
    const tableBody = document.getElementById('timetable-table-body');
    if (!tableBody) {
        console.error("Timetable table body not found!");
        return;
    }

    if (userTimetable.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-center dark:text-gray-400">
                    No courses added yet. Select school, subject, slot, and faculty to add a course.
                </td>
            </tr>
        `;
    } else {
        tableBody.innerHTML = userTimetable.map((entry, index) => `
            <tr class="${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}">
                <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${entry.slot.name || entry.slot.id}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${entry.courseCode}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${entry.courseName}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${entry.facultyName}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${entry.venue}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">${entry.credits}</td>
                <td class="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <button data-index="${index}" class="remove-course-btn text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Remove</button>
                </td>
            </tr>
        `).join('');

        document.querySelectorAll('#timetable-table-body .remove-course-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const indexToRemove = parseInt(e.target.dataset.index);
                removeCourse(indexToRemove);
            });
        });
    }
}

function removeCourse(index) {
    if (index >= 0 && index < userTimetable.length) {
        const removedCourse = userTimetable.splice(index, 1)[0];
        currentTotalCredits -= removedCourse.credits;
        if (currentTotalCredits < 0) currentTotalCredits = 0;

        updateTimetableDisplay();
        updateTotalCreditsDisplay();
        updateAdvancedTimetableDetails();
        hideErrorMessage();
        console.log("Course removed:", removedCourse);
        console.log("Current Timetable:", userTimetable);
    }
}

function updateTotalCreditsDisplay() {
    totalCreditsSpan.textContent = currentTotalCredits;
}

function updateAdvancedTimetableDetails() {
    const detailsContainer = advancedTimetableDetails;
    if (!detailsContainer) return;

    if (userTimetable.length === 0) {
        detailsContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400">Details for added courses will appear here.</p>';
        return;
    }

    detailsContainer.innerHTML = userTimetable.map((entry, index) => `
        <div class="mb-4 p-3 border border-gray-200 rounded-md dark:border-gray-600 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}">
            <h4 class="font-bold text-gray-900 dark:text-gray-100">${entry.courseName} (${entry.courseCode})</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300">
                Slot: <span class="font-semibold">${entry.slot.name || entry.slot.id}</span>
                (Day: ${entry.slot.day}, Time: ${entry.slot.start} - ${entry.slot.end})
            </p>
            <p class="text-sm text-gray-700 dark:text-gray-300">Faculty: ${entry.facultyName}</p>
            <p class="text-sm text-gray-700 dark:text-gray-300">Credits: ${entry.credits}</p>
            <p class="text-sm text-gray-700 dark:text-gray-300">Venue: ${entry.venue}</p>
            <button data-index="${index}" class="remove-course-btn mt-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 text-xs">Remove</button>
        </div>
    `).join('');
}


// --- Initial Load Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize display elements even before CSV load, so UI doesn't look broken.
    if (schoolSelect) schoolSelect.value = ""; // Reset school dropdown
    resetAndDisableDropdown(courseSelect, 'Select Subject...');
    resetAndDisableDropdown(slotSelect, 'Select Slot...');
    resetAndDisableDropdown(facultySelect, 'Select Faculty...');
    if (addCourseBtn) addCourseBtn.disabled = true;
    updateTimetableDisplay(); // Show "No courses added" message initially
    updateTotalCreditsDisplay();
    updateAdvancedTimetableDetails();


    // IMPORTANT: Delay CSV loading slightly if many DOM manipulations happen before
    // or ensure that all critical DOM elements are definitely ready.
    // For now, direct load is fine.
    loadCSVData(); // Load CSV data when the DOM is ready
});

// --- Placeholder Buttons ---
// Make sure these elements exist in your HTML
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');
const saveBtn = document.getElementById('save-btn');

if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        alert('Download functionality coming soon!');
    });
}
if (shareBtn) {
    shareBtn.addEventListener('click', () => {
        alert('Share functionality coming soon!');
    });
}
if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        alert('Save functionality coming soon!');
    });
}
