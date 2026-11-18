const express = require("express");
const router = express.Router();

const Student = require("../models/Student");

// 1. Register Student
router.post("/", async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();

        res.status(201).json({
            message: "Student Registered Successfully!",
            student
        });

    } catch (error) {
        res.status(400).json({
            message: error.code === 11000
                ? "Email already exists"
                : error.message
        });
    }
});

// 2. View All Students
router.get("/", async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json(students);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. Search Student
router.get("/search", async (req, res) => {
    try {
        const keyword = req.query.keyword || "";

        const students = await Student.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { email: { $regex: keyword, $options: "i" } },
                { department: { $regex: keyword, $options: "i" } }
            ]
        });

        res.json(students);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. Update Student
router.put("/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student Not Found"
            });
        }

        res.json({
            message: "Student Updated Successfully!",
            student
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 5. Delete Student
router.delete("/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student Not Found"
            });
        }

        res.json({
            message: "Student Deleted Successfully!"
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;