let logoutBtn = document.querySelector('#logout-btn');

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('jwt');

    window.location = '/index.html';
});

window.addEventListener('load', (event) => {
    populateAssignmentsTable();
});

async function populateAssignmentsTable() {
    const URL = 'http://localhost:8081/assignments';

    let res = await fetch(URL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}` // Include our JWT into the request
        }
        // credentials: 'include' // This is if you're using HttpSession w/ JSESSIONID cookies
    })

    if (res.status === 200) {
        let assignments = await res.json();

        let tbody = document.querySelector('#assignments-tbl > tbody');
        tbody.innerHTML = ''; // clear out the tbody

        // Iterate through assignments from the GET /assignments request
        // and populate table
        for (let assignment of assignments) {
            let tr = document.createElement('tr');

            let td1 = document.createElement('td');
            td1.innerText = assignment.id;

            let td2 = document.createElement('td');
            td2.innerText = assignment.assignmentName;

            let td3 = document.createElement('td');
            td3.innerText = (assignment.graderUsername ? assignment.grade : 'Not graded');
            td3.style.color = (assignment.graderUsername ? td3.style.color : 'RGB(255, 0, 0)');

            let td4 = document.createElement('td');
            td4.innerText = assignment.studentUsername;

            let td5 = document.createElement('td');
            td5.innerText = (assignment.graderUsername ? assignment.graderUsername : 'Not graded');
            td5.style.color = (assignment.graderUsername ? td5.style.color : 'RGB(255, 0, 0)');

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);

            let td6 = document.createElement('td');
            let imgElement = document.createElement('img');
            imgElement.setAttribute('src', `http://localhost:8081/assignments/${assignment.id}/image`);
            imgElement.style.height = '100px';
            td6.appendChild(imgElement);

            tr.appendChild(td6);

            // Populate assignments that aren't graded with an input and grade button
            if (!assignment.graderUsername) { // If the assignment hasn't been graded yet
                let gradeInput = document.createElement('input');
                gradeInput.setAttribute('type', 'number'); // <input type="number" />
                gradeInput.setAttribute('min', '0');
                gradeInput.setAttribute('max', '100');

                let gradeButton = document.createElement('button');
                gradeButton.innerText = 'Grade Assignment';

                // Whenever the grade button is clicked, send a PATCH request to change the grade
                // of an assignment (providing a valid JSON web token from localStorage that we received
                // when logging in) and repopulate the assignments table again
                gradeButton.addEventListener('click', async () => {
                    let grade = gradeInput.value;

                    try {
                        let res = await fetch(`http://localhost:8081/assignments/${assignment.id}?grade=${grade}`, {
                            // credentials: 'include' // HttpSession based login + authorization
                            method: 'PATCH',
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('jwt')}` // Include our JWT into the request
                            }
                        });

                        if (res.status === 200) {
                            populateAssignmentsTable(); // Have this function call itself
                        }

                    } catch (e) {
                        console.log(e);
                    }
                    
                });

                tr.appendChild(gradeInput);
                tr.appendChild(gradeButton);
            }

            

            tbody.appendChild(tr);
        }
    }
    
}
