if (window.location.pathname=="/login") {

    document.getElementById('loginfrom').addEventListener('submit', async function (e) {
        e.preventDefault(); 
        document.getElementById('loginbutton').disabled = true;
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const warningText = document.getElementById('message');
        
        if (!username || !password) {
            document.querySelector('.catcontainer').style.display = 'flex';
            warningText.textContent = 'All fields are required';
            return;
        }
    

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username ,password }),
            });
            const result = await response.json();
            console.log(result);
            
            if (response.ok) {
                window.location.href="/"
                
            } else {
                document.querySelector('.catcontainer').style.display = 'flex';
                warningText.textContent = result.message || 'An error occurred while login';
            }
        } catch (error) {
            document.querySelector('.catcontainer').style.display = 'flex';
            warningText.textContent = 'Failed login. Please try again.';
        }
    });
}

function handleoklogin(){
    document.querySelector('.catcontainer').style.display = 'none';
    document.getElementById('message').textContent=" "
    document.getElementById('loginbutton').disabled = false;

}