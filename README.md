# 🦇 DCAM Paradise: Data Hub & Binge Calculator

An interactive analytics dashboard built with **React.js** to explore metadata from the DC Animated Movie Universe. This project combines frontend engineering with data science principles to provide users with a functional planning tool.

## 🚀 Features

- **Runtime Analytics Dashboard:** Uses **Recharts** to visualize the distribution of movie lengths across the series.
- **Smart Recommender Algorithm:** A greedy optimization tool that generates a movie playlist based on user-defined time constraints.
- **Dynamic Filtering:** Search and filter capabilities by hero (Batman, Superman, etc.) or team (Justice League, Teen Titans).
- **Data Persistence:** Integrated **LocalStorage** to save user watchlists and progress across sessions.
- **Clean UI:** A responsive, dark-mode interface designed for high-density information display.

## 🛠 Tech Stack

- **Framework:** React.js
- **Data Manipulation:** JavaScript (ES6+) - focusing on `.filter()`, `.reduce()`, and `.map()`
- **Visualization:** Recharts
- **Storage:** Browser LocalStorage API
- **Deployment:** GitHub Pages

## 🧠 The "Smart Recommender" Logic

The recommendation engine follows a **Greedy Algorithm** approach. It iterates through the movie dataset to find the best combination of titles that fit within a user's specific time limit without exceeding it. This is a practical implementation of a variation of the **Knapsack Problem**, focusing on maximizing content within a fixed constraint.

## 📂 Project Structure

- `/src/dcam_data.json`: The central dataset containing movie IDs, titles, runtimes, and tags.
- `/src/BingeCalculator.js`: The main logic hub handling state, filtering, and the recommendation engine.

## 🔧 Installation & Setup

1. Clone the repository:
   ```bash
   git clone [https://github.com/MahenSandeepa/dcam-paradise.git](https://github.com/MahenSandeepa/dcam-paradise.git)
