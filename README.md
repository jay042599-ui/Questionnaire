# Insurance Questionnaire App

A free static quiz app using HTML, CSS, vanilla JavaScript and JSON.

## Files
- `index.html` — app interface
- `styles.css` — responsive styling
- `script.js` — quiz logic, timer, scoring and review
- `questions.json` — 40-question bank

## Features
- 40 questions: 30 multiple choice + 10 True/False
- 70% passing mark
- 30-minute countdown
- Previous/Next navigation
- Randomized answer choices
- Automatic scoring
- Full answer review
- Mobile responsive
- Keyboard-friendly controls
- No backend required

## Important
The included question bank contains sample insurance-training questions based on the material supplied in the project brief. Verify every question and answer against your official training material before using it for an actual assessment.

## Run locally
Because the app fetches `questions.json`, opening `index.html` directly with `file://` may block the JSON request. Use a local server instead.

If Python is installed:
`python -m http.server 8000`

Then open:
`http://localhost:8000`

## Free deployment
### GitHub Pages
1. Create a GitHub repository.
2. Upload all four files.
3. Open Settings -> Pages.
4. Select the main branch and root folder.
5. Save and open the Pages URL.

### Netlify
Create a new site from the repository or upload the project folder.

## Customize
Edit `questions.json`. Each question has:
- `id`
- `type`: `mcq` or `true_false`
- `question`
- `options`
- `answer`
