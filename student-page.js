window.addEventListener('load', (event) => {
    populateAssignmentsTable();
});

let logoutBtn = document.querySelector('#logout-btn');
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('jwt');

    window.location = '/index.html';
});

let assignmentSubmit = document.querySelector('#a-submit');
assignmentSubmit.addEventListener('click', async () => {
    let assignmentNameInput = document.querySelector('#a-name-input');
    let assignmentImageInput = document.querySelector('#a-file-input');

    let formData = new FormData();
    formData.append('assignmentName', assignmentNameInput.value);
    formData.append('image', assignmentImageInput.files[0]);

    try {
        let res = await fetch(`http://localhost:8081/users/${localStorage.getItem('user_id')}/assignments`, {
            // credentials: 'include', // Only for HttpSession authorization
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        });

        populateAssignmentsTable();
    } catch (e) {
        console.log(e);
    }
    
})

async function populateAssignmentsTable() {
    const URL = `http://localhost:8081/users/${localStorage.getItem('user_id')}/assignments`;

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

            let td6 = document.createElement('td');
            let imgElement = document.createElement('img');
            imgElement.setAttribute('src', `http://localhost:8081/assignments/${assignment.id}/image`);
            imgElement.style.height = '100px';
            td6.appendChild(imgElement);

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tr.appendChild(td6);

            tbody.appendChild(tr);
        }
    }
    
}