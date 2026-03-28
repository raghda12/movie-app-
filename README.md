# 🎬 Movie Browser App

A modern, responsive movie browsing web application built using **HTML, CSS, and Vanilla JavaScript**.  
The app fetches movie data from an external API and allows users to explore, preview, and search for movies.

---

## 🛠 Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Fetch API

---

## 🚀 How to Run

### 🔹 Option 1: Direct Open

- Download or clone the repository
- Open the `index.html` file in your browser

---

### 🔹 Option 2: Live Server (Recommended)

1. Open the project in Visual Studio Code
2. Install the **Live Server** extension
3. Right-click on `index.html`
4. Select **Open with Live Server**

---

## ⚙️ Assumptions

- The API provides `runtimeSeconds`, which is converted into hours and minutes
- Only one genre is displayed per movie for simplicity
- Only the first 20 movies are fetched to improve performance
- Live search was not implemented to avoid API rate limiting issues
- Some movies may not have poster images, so a fallback image is used

---

## 📊 Progress

| Requirement                    | Status | Notes                     |
| ------------------------------ | ------ | ------------------------- |
| Movie List                     | ✅     | Displays 20 movies        |
| Default Selected Movie         | ✅     | First movie auto-selected |
| Hover Behavior                 | ✅     | Preview works correctly   |
| Click Behavior                 | ✅     | Selection persists        |
| Background Update              | ✅     | Updates dynamically       |
| Search                         | ✅     | Works on Enter            |
| Loading / Error / Empty States | ✅     | Fully handled             |
| Responsive Design              | ✅     | Mobile-first approach     |
| Carousel Controls              | ✅     | Smooth scrolling          |
| Code Quality                   | ✅     | Clean and organized       |
| Missing Data Handling          | ✅     | Prevents UI breakage      |

---

## 🧠 Challenges

### API Rate Limiting (429 Error)

#### Problem

A large number of API requests were being sent when fetching details for each movie, which caused rate limiting errors.

#### Solution

- Fetch the movie list with a single request
- Load movie details only when needed (on hover or click)

```js
if (movie.detailLoaded) return;
```
