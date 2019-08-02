$(function () {
    $('#mycalendar').monthly();

    firebase.initializeApp(window.fbConfig.config);
    db = firebase.firestore();
    // db.collection('PRACTICE_COURSE').get().then(snap => {
    //     snap.forEach(doc => {
    //         let selectOption = document.createElement("option");
    //         selectOption.setAttribute("value", doc.data().practice_id);
    //         selectOption.innerHTML = doc.data().practice_name;

    //         $("#select_course").append(selectOption);
    //     });
    // });
    $('#reservation_table').dataTable();
    $("tbody > tr").on('click', function () {
        $(this).find('input').prop('checked', true);
        $('#select_course').val($(this).children()[1].textContent + " " + $(this).children()[2].textContent);
    })
});

// Insert lessons to DB
$(function () {
    db = firebase.firestore();
    $("#send-btn").on('click', function () {
        let selected_date = $("#select_date").val();
        let selected_course = $("#select_course").val();
        let num_of_people = $("#num_of_people").val();
        let name_of_person = $("#name_of_person").val();
        let tel_num = $("#tel").val();
        let email = $("#email").val();

        let email_contents = '<p>予約内容↓</p>'
                            +'<p>**************************************************************</p>'
                            +'<table><tr><td>予約日:</td><td>'+selected_date+'</td></tr>'
                            +'<tr><td>予約コース:</td><td>'+selected_course+'</td></tr>'
                            +'<tr><td>予約人数:</td><td>'+num_of_people+'名</td></tr>'
                            +'<tr><td>代表者:</td><td>'+name_of_person+'</td></tr>'
                            +'<tr><td>代表者TEL:</td><td>'+tel_num+'</td></tr>'
                            +'<tr><td>代表者メール:</td><td>'+email+'</td></tr></table>'
                            +'<p>**************************************************************</p>'


        var availabilityRef = db.collection('AVAILABILITY').doc(selected_date);
        availabilityRef.get().then(function (doc) {
            if (doc.exists) {
                let update_num = doc.data().remaining_num - 1
                if (update_num >= 0) {
                    availabilityRef.update({
                        remaining_num: update_num
                    })
                    console.log("Update remaining_num:", update_num);

                    db.collection("REQUESTED_LESSONS").add({
                        course: selected_course,
                        date: new Date(selected_date),
                        email: email,
                        name_of_person: name_of_person,
                        num_of_people: num_of_people,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    })
                        .then(function (docRef) {
                            console.log("Document written with ID: ", docRef.id);
                            $.post(EMAIL_FUNCTIONS_URL+'?adding_sbj='+name_of_person+'&msg_cnt='+email_contents)
                            alert('申し込みが完了しました。')
                            location.reload();
                        })
                        .catch(function (error) {
                            console.error("Error adding document: ", error);
                        });

                } else {
                    console.log('update_num should be zere or greater')
                }

            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    });
});



