// Global variables
let allCourseData = []; // To store all parsed data from CSV
let selectedCourses = []; // To store courses added to the user's timetable
let timeSlots = {}; // Define your standard time slots here if not derived from CSV
                          // Example structure: { 'A': { days: ['Mon', 'Thu'], start: '08:00', end: '08:50' }, ... }

// DOM Elements (get references once for efficiency)
const campusSelect = document.getElementById('campus-select'); // Kept for future multi-campus support
const advancedViewBtn = document.getElementById('advanced-view-btn');
const themeToggle = document.getElementById('theme-toggle');

// Form Elements
const courseForm = document.getElementById('course-form');
const courseSelect = document.getElementById('course-select');
const slotFacultySection = document.getElementById('slot-faculty-section');
const slotSelect = document.getElementById('slot-select');
const facultySelect = document.getElementById('faculty-select');
const addCourseBtn = document.getElementById('add-course-btn');
const errorMessage = document.getElementById('error-message');
const totalCreditsSpan = document.getElementById('total-credits');

// Timetable Elements
const timetableTableBody = document.getElementById('timetable-table-body');
const visualTimetable = document.getElementById('visual-timetable'); // This is the main timetable grid container

// Modal Elements
let advancedViewModal = document.getElementById('advanced-view-modal');
const closeAdvancedModalBtn = document.getElementById('close-advanced-modal');
const advancedModalSaveBtn = document.getElementById('advanced-modal-save');
const advancedTimetableDetails = document.getElementById('advanced-timetable-details');

// Buttons
const saveBtn = document.getElementById('save-btn');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');


/**
 * Helper to fetch and parse CSV data.
 * @param {string} url The URL of the CSV file.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of parsed objects.
 */
async function fetchCsvData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Throw an error if HTTP status is not 2xx
            throw new Error(`HTTP error! Status: ${response.status} (${response.statusText}) while fetching '${url}'`);
        }
        const text = await response.text();
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        if (lines.length === 0) {
            console.warn("CSV file is empty.");
            return [];
        }

        const headers = lines[0].split(',').map(header => header.trim());
        const data = [];

        // Identify crucial column indices
        const courseCodeIndex = headers.indexOf('COURSE CODE');
        const empNameIndex = headers.indexOf('EMP NAME');
        const slotIndex = headers.indexOf('SLOT');
        const courseTitleIndex = headers.indexOf('COURSE TITLE');
        const venueIndex = headers.indexOf('VENUE');
        const creditsIndex = headers.indexOf('CREDITS'); // Assuming 'CREDITS' column exists

        // Basic validation for essential headers
        if (courseCodeIndex === -1 || empNameIndex === -1 || slotIndex === -1) {
            console.error("Error: Essential columns ('COURSE CODE', 'EMP NAME', 'SLOT') are missing in the CSV header.");
            return [];
        }

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            // Handle cases where a line might have fewer columns than expected, or empty strings
            // Trim values to remove leading/trailing whitespace
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] ? values[index].trim() : '';
            });

            // --- IMPORTANT: The check you had before for missing data ---
            // Row number for logging (1-based, skipping header)
            const logRowNumber = i + 1;

            if (!row['COURSE CODE'] || !row['EMP NAME'] || !row['SLOT']) {
                console.warn(
                    `Skipping row ${logRowNumber} due to missing 'COURSE CODE', 'EMP NAME', or 'SLOT'. Data:`,
                    row
                );
                continue; // Skip this row
            }
            // --- End of important check ---

            // Normalize and parse relevant data for easier access
            data.push({
                courseCode: row['COURSE CODE'],
                courseTitle: row['COURSE TITLE'] || 'N/A', // Provide default if missing
                empName: row['EMP NAME'],
                slot: row['SLOT'],
                venue: row['VENUE'] || 'N/A',
                credits: parseInt(row['CREDITS'] || '0', 10), // Convert to number, default to 0
                originalRowData: row // Keep original row for debugging if needed
            });
        }
        return data;
    } catch (error) {
        console.error("Failed to load or process course data. Please check the browser console (F12) for detailed error messages. Common issues: CSV file not found, incorrect CSV format, or network problems.", error);
        alert("Failed to load course data. Please check console for details.");
        return [];
    }
}

/**
 * Populates the course dropdown with unique courses from allCourseData.
 */
function populateCourseDropdown() {
    courseSelect.innerHTML = '<option value="">Select Course...</option>'; // Reset options
    const uniqueCourses = new Set();
    const courseMap = new Map(); // To store courseCode -> CourseTitle mapping

    allCourseData.forEach(course => {
        if (!uniqueCourses.has(course.courseCode)) {
            uniqueCourses.add(course.courseCode);
            courseMap.set(course.courseCode, course.courseTitle);
        }
    });

    // Sort unique courses by course code
    const sortedCourseCodes = Array.from(uniqueCourses).sort();

    sortedCourseCodes.forEach(code => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${code} - ${courseMap.get(code)}`;
        courseSelect.appendChild(option);
    });

    courseSelect.disabled = false; // Enable the course dropdown
}

/**
 * Populates the slot and faculty dropdowns based on the selected course.
 */
function populateSlotAndFacultyDropdowns(selectedCourseCode) {
    slotSelect.innerHTML = '<option value="">Select Slot...</option>';
    facultySelect.innerHTML = '<option value="">Select Faculty...</option>';
    slotSelect.disabled = true;
    facultySelect.disabled = true;
    addCourseBtn.disabled = true;
    errorMessage.classList.add('hidden'); // Clear any previous error message
    slotFacultySection.classList.add('hidden'); // Hide until selections are made

    if (!selectedCourseCode) {
        return;
    }

    const availableSlots = new Set();
    const slotFacultyMap = new Map(); // slot -> [{ empName, venue }]

    allCourseData
        .filter(course => course.courseCode === selectedCourseCode)
        .forEach(course => {
            availableSlots.add(course.slot);
            if (!slotFacultyMap.has(course.slot)) {
                slotFacultyMap.set(course.slot, []);
            }
            slotFacultyMap.get(course.slot).push({ empName: course.empName, venue: course.venue });
        });

    const sortedSlots = Array.from(availableSlots).sort();
    sortedSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        slotSelect.appendChild(option);
    });

    slotSelect.disabled = false;
    slotFacultySection.classList.remove('hidden');

    // Event listener for slot selection to populate faculty
    slotSelect.onchange = () => {
        const selectedSlot = slotSelect.value;
        facultySelect.innerHTML = '<option value="">Select Faculty...</option>'; // Reset faculty
        facultySelect.disabled = true;
        addCourseBtn.disabled = true;
        errorMessage.classList.add('hidden');

        if (selectedSlot) {
            const facultiesForSlot = slotFacultyMap.get(selectedSlot);
            if (facultiesForSlot) {
                // Sort faculties by name for consistent display
                facultiesForSlot.sort((a, b) => a.empName.localeCompare(b.empName));
                facultiesForSlot.forEach(f => {
                    const option = document.createElement('option');
                    option.value = f.empName; // Store faculty name as value
                    option.textContent = `${f.empName} (Venue: ${f.venue})`;
                    facultySelect.appendChild(option);
                });
                facultySelect.disabled = false;
            }
        }
    };

    // Enable Add Course button only when all fields are selected
    facultySelect.onchange = () => {
        if (courseSelect.value && slotSelect.value && facultySelect.value) {
            addCourseBtn.disabled = false;
        } else {
            addCourseBtn.disabled = true;
        }
        errorMessage.classList.add('hidden');
    };
}


/**
 * Renders the user's schedule in the table and visual timetable.
 */
function renderTimetable() {
    timetableTableBody.innerHTML = '';
    let currentTotalCredits = 0; // Use a local variable here

    if (selectedCourses.length === 0) {
        timetableTableBody.innerHTML = `<tr>
            <td colspan="7" class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-center dark:text-gray-400">
                No courses added yet.
            </td>
        </tr>`;
    } else {
        selectedCourses.forEach((course, index) => {
            currentTotalCredits += course.credits; // Use the local variable
            const row = document.createElement('tr');
            row.classList.add('hover:bg-gray-50', 'dark:hover:bg-gray-700');
            row.innerHTML = `
                <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${course.slot}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${course.courseCode}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${course.courseTitle}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${course.empName}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${course.venue}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${course.credits}</td>
                <td class="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <button data-index="${index}" class="remove-course-btn text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Remove</button>
                </td>
            `;
            timetableTableBody.appendChild(row);
        });

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-course-btn').forEach(button => {
            button.onclick = (event) => {
                const indexToRemove = parseInt(event.target.dataset.index);
                selectedCourses.splice(indexToRemove, 1);
                renderTimetable(); // Re-render after removal
                // No need to call renderVisualTimetable() separately here, as renderTimetable() already calls it.
            };
        });
    }

    totalCreditsSpan.textContent = currentTotalCredits; // Update total credits
    renderVisualTimetable(); // Always re-render visual timetable
}


/**
 * Renders the visual timetable grid. This is a complex function
 * and might need detailed mapping of slots to days/times based on your data.
 * For now, this is a placeholder. You'll need actual slot-to-time mapping.
 */
function renderVisualTimetable() {
    // Clear previous timetable cells, except for header
    // Select all divs that are not the first row (the header)
    const existingContentCells = visualTimetable.querySelectorAll('div:not(.col-span-1):not(:first-child):not([id^="time-label-"])');
    existingContentCells.forEach(cell => cell.remove());


    // Example fixed times (you'd generate these dynamically or from a config)
    const times = [
        "08:00 - 08:50", "09:00 - 09:50", "10:00 - 10:50", "11:00 - 11:50",
        "12:00 - 12:50", "13:00 - 13:50", "14:00 - 14:50", "15:00 - 15:50",
        "16:00 - 16:50", "17:00 - 17:50"
    ];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Placeholder: You need to map actual slots (like A, B, C, TA, TB, L1+L2, etc.)
    // to their specific day(s) and time(s) to populate the grid.
    // This mapping usually comes from a separate configuration or is derived from your CSV data.
    // For demonstration, let's assume a dummy mapping for a few common slots.
    // **IMPORTANT: YOU NEED TO DEFINE THIS MAP ACCURATELY FOR YOUR FFCS SLOTS**
    const slotToTimeDayMap = {
        'A': [{ day: 'Mon', timeIndex: 0 }, { day: 'Thu', timeIndex: 0 }],
        'B': [{ day: 'Tue', timeIndex: 0 }, { day: 'Fri', timeIndex: 0 }],
        'C': [{ day: 'Wed', timeIndex: 0 }, { day: 'Sat', timeIndex: 0 }],
        'D': [{ day: 'Mon', timeIndex: 1 }, { day: 'Thu', timeIndex: 1 }],
        'E': [{ day: 'Tue', timeIndex: 1 }, { day: 'Fri', timeIndex: 1 }],
        'F': [{ day: 'Wed', timeIndex: 1 }, { day: 'Sat', timeIndex: 1 }],
        'G': [{ day: 'Mon', timeIndex: 2 }, { day: 'Thu', timeIndex: 2 }],
        'TA': [{ day: 'Tue', timeIndex: 2 }], // Example for lab/tutorial slots
        'TB': [{ day: 'Wed', timeIndex: 2 }],
        // Add more mappings as per your FFCS slot structure (e.g., 'L1+L2', 'L31+L32', etc.)
        // Example for combined slots like L1+L2. This might take up multiple time slots/cells visually.
        // You'll need logic to handle merging cells or placing content in multiple cells.
        // For simplicity, this example just places it in the first time slot.
        'L1+L2': [{ day: 'Mon', timeIndex: 3 }],
        'L31+L32': [{ day: 'Tue', timeIndex: 3 }],
    };


    // Clear all content cells and re-initialize the grid layout
    // We already have the header row from HTML. We need to add time labels and content cells below it.
    // Remove all cells that are not header cells to redraw
    const existingGridContent = visualTimetable.querySelectorAll('.grid-timetable-content-cell');
    existingGridContent.forEach(cell => cell.remove());


    // Append time labels and empty cells
    for (let t = 0; t < times.length; t++) {
        // Add time labels
        const timeCell = document.createElement('div');
        timeCell.className = 'col-span-1 p-2 border-r border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 grid-timetable-time-label';
        timeCell.textContent = times[t];
        visualTimetable.appendChild(timeCell); // Append to the main grid container

        for (let d = 0; d < days.length; d++) {
            const cell = document.createElement('div');
            cell.id = `cell-${days[d]}-${t}`; // Unique ID for each cell
            cell.className = 'col-span-1 p-2 border-r border-b border-gray-300 dark:border-gray-600 flex items-center justify-center text-center overflow-hidden h-full min-h-[80px] text-gray-400 dark:text-gray-600 grid-timetable-content-cell';
            cell.textContent = ''; // Empty initially
            visualTimetable.appendChild(cell); // Append to the main grid container
        }
    }


    // Populate cells with selected courses
    selectedCourses.forEach(course => {
        const { courseCode, slot, empName } = course;

        // Iterate through the assumed slot-to-timeDay mapping
        if (slotToTimeDayMap[slot]) {
            slotToTimeDayMap[slot].forEach(mapping => {
                const day = mapping.day;
                const timeIndex = mapping.timeIndex;

                const targetCell = document.getElementById(`cell-${day}-${timeIndex}`); // Get cell by its ID

                if (targetCell) {
                    // Check if cell already has content (for overlap visualization)
                    if (targetCell.children.length > 0) {
                        // If there's an overlap, you might want to change the background to red
                        // or display a warning. For simplicity, just append to existing content.
                        const existingContent = targetCell.innerHTML;
                        targetCell.innerHTML = `
                            ${existingContent}
                            <div class="bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-100 rounded-md p-1 w-full h-full flex flex-col justify-center items-center text-xs sm:text-sm overflow-hidden mt-1">
                                <span class="font-bold">${courseCode}</span>
                                <span class="text-xs">${slot}</span>
                                <span class="text-xs">${empName.split(' ')[0]}</span>
                                <span class="text-xxs text-red-600">(OVERLAP!)</span>
                            </div>
                        `;
                    } else {
                        targetCell.innerHTML = `
                            <div class="bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-100 rounded-md p-1 w-full h-full flex flex-col justify-center items-center text-xs sm:text-sm overflow-hidden">
                                <span class="font-bold">${courseCode}</span>
                                <span class="text-xs">${slot}</span>
                                <span class="text-xs">${empName.split(' ')[0]}</span>
                            </div>
                        `;
                    }
                    targetCell.classList.remove('text-gray-400', 'dark:text-gray-600'); // Remove empty placeholder styling
                }
            });
        } else {
            console.warn(`Slot '${slot}' not found in visual timetable mapping. Course ${courseCode} not displayed.`);
        }
    });
}


/**
 * Checks for slot overlaps. This function needs to be robust for FFCS slots.
 * @param {string} newSlot The slot of the new course.
 * @returns {boolean} True if there's an overlap, false otherwise.
 */
function checkForOverlap(newSlot) {
    // **IMPORTANT**: This is a simplified overlap check.
    // For a real FFCS system, you need a precise mapping of
    // every slot (e.g., A, B, L1+L2, TA) to its exact days and times.
    // Then you would compare the time blocks.

    // A simple check: if any existing course has the exact same slot string, it's an overlap.
    // This assumes each unique slot string represents a unique, non-overlapping time block.
    // This will catch basic overlaps but might miss complex ones (e.g., L1 overlapping with a half-slot).
    return selectedCourses.some(c => c.slot === newSlot);
}

// --- Event Listeners ---

// Initialize campus select (no change needed here)
campusSelect.addEventListener('change', () => {
    // Logic for changing campus and re-loading data if necessary
    // For now, assuming only "Vellore Campus" is active.
    console.log('Campus changed to:', campusSelect.value);
});


// Course selection change
courseSelect.addEventListener('change', () => {
    populateSlotAndFacultyDropdowns(courseSelect.value);
});

// Add Course form submission
courseForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const selectedCourseCode = courseSelect.value;
    const selectedSlot = slotSelect.value;
    const selectedFaculty = facultySelect.value;

    if (!selectedCourseCode || !selectedSlot || !selectedFaculty) {
        errorMessage.textContent = "Please select course, slot, and faculty.";
        errorMessage.classList.remove('hidden');
        return;
    }

    // Find the exact course details from allCourseData
    const courseToAdd = allCourseData.find(course =>
        course.courseCode === selectedCourseCode &&
        course.slot === selectedSlot &&
        course.empName === selectedFaculty
    );

    if (courseToAdd) {
        if (checkForOverlap(courseToAdd.slot)) {
            errorMessage.textContent = "This slot overlaps with an existing course in your schedule!";
            errorMessage.classList.remove('hidden');
        } else {
            selectedCourses.push(courseToAdd);
            renderTimetable();
            errorMessage.classList.add('hidden'); // Hide error if successful
            // Reset form for next entry
            courseSelect.value = ''; // Reset course dropdown
            slotSelect.innerHTML = '<option value="">Select Slot...</option>'; // Clear slots
            facultySelect.innerHTML = '<option value="">Select Faculty...</option>'; // Clear faculties
            slotSelect.disabled = true;
            facultySelect.disabled = true;
            addCourseBtn.disabled = true;
            slotFacultySection.classList.add('hidden'); // Hide section again
            saveTimetableToLocalStorage(); // Save schedule after adding a course
        }
    } else {
        errorMessage.textContent = "Could not find selected course details. Please try again.";
        errorMessage.classList.remove('hidden');
    }
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    // Store preference in localStorage
    if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// Advanced View Modal
advancedViewBtn.addEventListener('click', () => {
    advancedViewModal.classList.remove('hidden');
    // Populate advanced timetable details
    if (selectedCourses.length > 0) {
        advancedTimetableDetails.innerHTML = '<h4>Currently Selected Courses:</h4>';
        selectedCourses.forEach(course => {
            const p = document.createElement('p');
            p.textContent = `${course.courseCode} (${course.slot}) - ${course.courseTitle} by ${course.empName} @ ${course.venue}`;
            advancedTimetableDetails.appendChild(p);
        });
    } else {
        advancedTimetableDetails.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No courses added yet for advanced view.</p>';
    }
});

closeAdvancedModalBtn.addEventListener('click', () => {
    advancedViewModal.classList.add('hidden');
});

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === advancedViewModal) {
        advancedViewModal.classList.add('hidden');
    }
});

advancedModalSaveBtn.addEventListener('click', () => {
    // Implement save logic for advanced view if editing was enabled
    alert('Advanced view save not implemented yet!');
    advancedViewModal.classList.add('hidden');
});

/**
 * Saves the current selected courses to local storage.
 */
function saveTimetableToLocalStorage() {
    try {
        localStorage.setItem('ffcsPlannerSchedule', JSON.stringify(selectedCourses));
        console.log("Schedule saved to local storage.");
    } catch (e) {
        console.error("Error saving schedule to local storage:", e);
        alert("Could not save schedule to local storage. Browser storage might be full or disabled.");
    }
}

/**
 * Loads the saved schedule from local storage.
 */
function loadTimetableFromLocalStorage() {
    const savedSchedule = localStorage.getItem('ffcsPlannerSchedule');
    if (savedSchedule) {
        try {
            selectedCourses = JSON.parse(savedSchedule);
            console.log("Schedule loaded from local storage.");
        } catch (e) {
            console.error("Error parsing saved schedule from local storage:", e);
            localStorage.removeItem('ffcsPlannerSchedule'); // Clear corrupt data
            selectedCourses = []; // Start with an empty schedule
        }
    }
}

// Save, Download, Share buttons
saveBtn.addEventListener('click', () => {
    saveTimetableToLocalStorage();
    alert('Timetable saved to your browser!');
});

downloadBtn.addEventListener('click', () => {
    // Implement download functionality (e.g., generate PDF or image)
    alert('Download functionality coming soon!');
    // Example: generate a simple text file
    const textContent = selectedCourses.map(c =>
        `Course Code: ${c.courseCode}\nCourse Title: ${c.courseTitle}\nSlot: ${c.slot}\nFaculty: ${c.empName}\nVenue: ${c.venue}\nCredits: ${c.credits}\n---`
    ).join('\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'FFCS_Timetable.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

shareBtn.addEventListener('click', () => {
    // Implement share functionality (e.g., generate a shareable URL, though this needs backend)
    alert('Share functionality coming soon!');
});


// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    // Apply saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // Load data from CSV
    // **** IMPORTANT: Change this path to your CSV file name! ****
    // You uploaded 'ALL_ALLOCATION_COMPLETE (1).csv', so use that.
    allCourseData = await fetchCsvData('ALL_ALLOCATION_COMPLETE (1).csv');

    if (allCourseData.length > 0) {
        populateCourseDropdown();
        loadTimetableFromLocalStorage(); // Load existing schedule after data is ready
        renderTimetable(); // Initial render of the schedule
    } else {
        console.error("No course data loaded. Cannot populate dropdowns.");
    }

    renderVisualTimetable(); // Initial render of empty/default visual timetable grid
});
