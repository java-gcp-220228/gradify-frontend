let navElement = document.querySelector('#navbar');

if (localStorage.getItem('user_id') && localStorage.getItem('jwt') && localStorage.getItem('user_role')) {
    if (localStorage.getItem('user_role') === 'trainer') {
        let trainerLink = document.createElement('a');
        trainerLink.setAttribute('href', 'trainer-page.html');
        trainerLink.innerText = 'Trainer Page';

        navElement.appendChild(trainerLink);
    } else if (localStorage.getItem('user_role') === 'student') {
        let studentLink = document.createElement('a');
        studentLink.setAttribute('href', 'student-page.html');
        studentLink.innerText = 'Student Page';

        navElement.appendChild(studentLink);
    }
}