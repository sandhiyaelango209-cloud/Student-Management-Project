const API = "/api/students";

const form = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const message = document.getElementById("message");
const search = document.getElementById("search");

// Prevent HTML injection when displaying student data
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Register or Update Student
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("studentId").value;

    const student = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        department: document.getElementById("department").value,
        year: document.getElementById("year").value
    };

    try {
        const response = await fetch(
            id ? `${API}/${id}` : API,
            {
                method: id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(student)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        message.textContent = result.message;
        message.style.color = "green";

        form.reset();
        document.getElementById("studentId").value = "";
        document.getElementById("submitBtn").textContent =
            "Register Student";

        loadStudents();

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "red";
    }
});

// View All Students
async function loadStudents(keyword = "") {
    try {
        const url = keyword
            ? `${API}/search?keyword=${encodeURIComponent(keyword)}`
            : API;

        const response = await fetch(url);
        const students = await response.json();

        if (!response.ok) throw new Error("Unable to load students");

        studentList.innerHTML = "";

        if (students.length === 0) {
            studentList.innerHTML =
                `<tr><td colspan="6">No Students Found</td></tr>`;
            return;
        }

        students.forEach(student => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHTML(student.name)}</td>
                <td>${escapeHTML(student.email)}</td>
                <td>${escapeHTML(student.phone)}</td>
                <td>${escapeHTML(student.department)}</td>
                <td>${escapeHTML(student.year)}</td>
                <td>
                    <button class="edit"
                        onclick="editStudent('${student._id}')">
                        Edit
                    </button>

                    <button class="delete"
                        onclick="deleteStudent('${student._id}')">
                        Delete
                    </button>
                </td>
            `;

            studentList.appendChild(row);
        });

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "red";
    }
}

// Search Student
search.addEventListener("input", () => {
    loadStudents(search.value.trim());
});

// Edit Student
async function editStudent(id) {
    try {
        const response = await fetch(API);
        const students = await response.json();

        if (!response.ok) throw new Error("Unable to fetch students");

        const student = students.find(s => s._id === id);

        if (!student) {
            throw new Error("Student not found");
        }

        document.getElementById("studentId").value = student._id;
        document.getElementById("name").value = student.name;
        document.getElementById("email").value = student.email;
        document.getElementById("phone").value = student.phone;
        document.getElementById("department").value = student.department;
        document.getElementById("year").value = student.year;

        document.getElementById("submitBtn").textContent =
            "Update Student";

        window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
        message.textContent = error.message;
    }
}

// Delete Student
async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    try {
        const response = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) throw new Error(result.message);

        message.textContent = result.message;
        message.style.color = "green";

        loadStudents();

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "red";
    }
}

// Load students when page opens
loadStudents();