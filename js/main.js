// Select courses from DB
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

// Innsert lessons to DB
$(function () {

    db = firebase.firestore();
    $("#send-btn").on('click', function () {
        let selected_date = $("#select_date").val();
        let selected_course = $("#select_course").val();
        let num_of_people = $("#num_of_people").val();
        let name_of_person = $("#name_of_person").val();
        let email = $("#email").val();

        db.collection("REQUESTED_LESSONS").add({
        course: selected_course,
        date: new Date(selected_date),
        email: email,
        name_of_person: name_of_person,
        num_of_people: num_of_people,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    });
});



