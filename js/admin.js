function logoutAdmin(){
    localStorage.removeItem("gaidi_admin_logged_in");
    window.location.href = "admin-login.html";
}

function protectAdmin(){
    if(localStorage.getItem("gaidi_admin_logged_in") !== "true"){
        window.location.href = "admin-login.html";
    }
}

function saveDraft(message){
    alert(message + " Saved locally for now. Google Sheets/database connection will be added later.");
}