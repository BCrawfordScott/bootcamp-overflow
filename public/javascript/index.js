
async function changeRole(newRole) {
    const csrfToken = document.getElementById('csrfToken').dataset.token;
    const headers = new Headers({
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
    });
    const response = await fetch(
        `/api${document.location.pathname}/changerole`,
        {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ role: newRole }),
        }
    );

    const { message } = await response.json();

    console.log(message);
}

function addRoleSelector(el) {
    const { target } = el.dataset;
    console.log(el.dataset);
    el.addEventListener('click', () => {
        changeRole(target);
    })
}

function setupRoleSelector() {
    const buttons = document.getElementsByClassName('btn not-active');

    for (let i = 0; i < buttons.length; i++) {
        addRoleSelector(buttons[i]);
        
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupRoleSelector();
});
