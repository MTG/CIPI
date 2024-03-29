# Can I Play It (CIPI)

This project involves building a web-based tool for exploring and recommending classical music pieces using existing deep learning models. The dataset of classical music scores in PDF format has already been collected from IMSLP (https://imslp.org/ ) and transcribed to machine-readable format using Optical Music Recognition (OMR) (https://en.wikipedia.org/wiki/Optical_music_recognition ) to extract relevant features. A deep learning model has been also trained to classify the music pieces into different categories of difficulty. The goal of the project is to develop a user-friendly web interface for searching, filtering, and recommending music pieces based on various difficulty criteria and other metadata. Through the project, students will learn techniques for deep learning model distillation to create a smaller, faster model suitable for web deployment, how to deploy OpenCV on the web, and how to design interfaces to effectively deploy the current advances in artificial intelligence. Overall, this project provides an opportunity to learn how to deploy a deep learning model on the web while gaining a foundational understanding of structuring large music collections and recommender systems.

# Project structure
- `/frontend`: Next.js (React) web app. 
- `/backend`: Python (Flask) API

# Developer setup
- Follow the instructions in `/backend/README.md` to start the backend
- Follow the instructions in `/frontend/README.md` to start the frontend
