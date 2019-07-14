$(function () {
    $('#mycalendar').monthly();

    firebase.initializeApp(window.fbConfig.config);
    db = firebase.firestore();
    db.collection('PRACTICE_COURSE').get().then(snap => {
        snap.forEach(doc => {
            let selectOption = document.createElement("option");
            selectOption.setAttribute("value", doc.data().practice_id);
            selectOption.innerHTML = doc.data().practice_name;

            $("#select_course").append(selectOption);
        });
    });

});
