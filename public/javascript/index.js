
async function fetchWrap ({ path, method, body }) {
    const csrfToken = document.getElementById('csrfToken').dataset.token;
    const headers = new Headers({
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
    });

    return await fetch(
        path,
        {
            method,
            headers,
            body: JSON.stringify(body)
        }
    )
}

async function reqRoleChange(newRole) {
    const response = await fetchWrap({
        path: `/api${document.location.pathname}/changerole`,
        method: 'PATCH',
        body: { role: newRole },
    });

    return response;
};

async function changeRole(newRole) {
    const buttons = Array.from(document.querySelectorAll('[aria-label="roleChange"]'));
    buttons.forEach(btn => btn.removeEventListener('click', handleChangeRole));
    
    const response = await reqRoleChange(newRole)

    if (response.ok) {
        const { newRole } = await response.json()
        const oldButton = document.querySelector('.btn.btn-outline-warning.active')
        oldButton.classList.remove('active');
        oldButton.classList.add('not-active');
        const newButton = document.querySelector(`[aria-id="${newRole}"]`);
        newButton.classList.add('active');

        setupRoleSelector();
    } else {

        console.log("Not ok", response);
    }
} 

function handleChangeRole (e) {
    const { role } = e.target.dataset;
    changeRole(role);
 }

function addRoleSelector(el) {
    el.addEventListener('click', handleChangeRole)
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
