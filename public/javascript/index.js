
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
    const loading = document.getElementById('loading-spinner');
    loading.classList.remove('visually-hidden');
    
    const response = await reqRoleChange(newRole)

    if (response.ok) {
        const { newRole } = await response.json()
        const oldButton = document.querySelector('.btn.btn-outline-warning.active')
        oldButton.classList.remove('active');
        oldButton.classList.add('not-active');
        const newButton = document.querySelector(`[aria-id="${newRole}"]`);
        newButton.classList.add('active');
        const title = document.querySelector('span.lead');
        title.childNodes[0].nodeValue = `${newRole.toUpperCase()}`
        loading.classList.add('visually-hidden')

        const alert = document.getElementById('alert')
        alert.innerText = "Role successfully changed"
        alert.classList.add('alert-warning');
        alert.classList.remove('visually-hidden');
        setTimeout(() => {
            alert.classList.add('fade');
            setTimeout(() => {
                alert.classList.add('visually-hidden');
                alert.classList.remove('fade');
                alert.classList.remove('alert-warning');
            }, 1000);
        }, 5000);

        setupRoleSelector();
    } else {
        loading.classList.add('visually-hidden')
        const alert = document.getElementById('alert')
        alert.innerText = "Unable to change role"
        alert.classList.add('alert-danger');
        alert.classList.remove('visually-hidden');
        setTimeout(() => {
            alert.classList.add('fade');
            setTimeout(() => {
                alert.classList.add('visually-hidden');
                alert.classList.remove('fade');
                alert.classList.remove('alert-danger');
            }, 1000);
        }, 5000);

        setupRoleSelector();
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
