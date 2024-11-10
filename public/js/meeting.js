document.addEventListener('DOMContentLoaded', () => {
    
    async function scheduleMeeting(event) {

        const scheduleMeetingDialog = document.getElementById("scheduleMeetingDialog");
        const scheduleMeetingBtn = document.querySelectorAll("#scheduleMeetingBtn");
        const scheduleMeetingForm = document.getElementById("scheduleMeetingForm");
        const cancelBtn = document.getElementById("cancelBtn");

        scheduleMeetingBtn.forEach(btn => btn.addEventListener("click", () => {
            scheduleMeetingDialog.showModal();
        }));

        cancelBtn.addEventListener("click", () => {
            scheduleMeetingDialog.close();
        });

        scheduleMeetingForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const meetingTitle = document.getElementById("meetingTitle").value;
            const meetingDate = document.getElementById("meetingDate").value;
            const meetingTime = document.getElementById("meetingTime").value;
            const participants = document.getElementById("participants").value;

            try {
                const response = await fetch("/scheduleMeeting", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: meetingTitle,
                        date: meetingDate,
                        time: meetingTime,
                        participants: participants.split(",").map(email => email.trim()),
                    }),
                });

                if (response.ok) {
                    alert("Meeting scheduled successfully!");
                    scheduleMeetingDialog.close();
                } else {
                    const error = await response.json();
                    alert(`Failed to schedule meeting: ${error.message}`);
                }
            } catch (error) {
                console.error("Error scheduling meeting:", error);
                alert("An error occurred while scheduling the meeting.");
            }
        });
    }

    scheduleMeeting();

async function delete_meeting(){ 
    const delete_meeting_btn = document.querySelectorAll('#delete_meeting_btn');
    delete_meeting_btn.forEach((btn) => {
        btn.addEventListener("click", async () => {
            const meeting_id = btn.getAttribute('data-meeting-id');
            console.log(meeting_id);
            const response = await fetch('/meetings/deletemeeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ meeting_id })
            });
            if (response.ok) {
                alert('Meeting deleted successfully!');
                window.location.reload();
            } else {
                const error = await response.json();
                alert(`Failed to delete meeting: ${error.message}`);
            }
        })
    })
}; 
delete_meeting();

const update_meeting_btn = document.querySelectorAll('#update_meeting_btn');
const update_meeting_dialog = document.getElementById('updateMeetingDialog');
const update_meeting_form = document.getElementById('updateMeetingForm');
const cancel_update_meeting_btn = document.getElementById('cancel_meeting_update');
let meeting_id = null;
update_meeting_btn.forEach((btn) => {
    btn.addEventListener('click', () => {
        meeting_id = btn.getAttribute('data-meeting-id');
        update_meeting_dialog.showModal();
        update_meeting_form.setAttribute('data-meeting-id', meeting_id);    
    });
});
update_meeting_form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('updatemeetingName').value;
    const date = document.getElementById('updatemeetingDate').value;
    const time = document.getElementById('updatemeetingTime').value;
    const participants = document.getElementById('updateMeetingParticipants').value;
    try {
        const response = await fetch('/meetings/updatemeeting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ meeting_id, title, date, time, participants })
        });
        if (response.ok) {
            alert('Meeting updated successfully!');
            window.location.reload();
        } else {
            const error = await response.json();
            alert(`Failed to update meeting: ${error.message}`);
        }
    } catch (error) {
        console.error('Error updating meeting:', error);
        alert('An error occurred while updating the meeting.');
    }
})
cancel_update_meeting_btn.addEventListener('click', () => {
     update_meeting_dialog.close();
});


    function setTheme(theme) {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            localStorage.setItem('color-theme', theme);
        }

        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setTheme('dark');
        } else {
            setTheme('light');
        }

        document.querySelectorAll('.view-meeting-btn').forEach(button => {
            button.addEventListener('click', function() {
               const meeting_id = this.getAttribute('data-meeting-id');
               const meeting_details = document.querySelectorAll('.meeting-details');
               meeting_details.forEach(item => {
                   if (item.getAttribute('data-meeting-id') === meeting_id) {
                      item.classList.toggle('hidden');
                   } else {
                     item.classList.add('hidden');
                   }
               });
            });
        });

        const meetingItems = document.querySelectorAll('.meeting-item');
        meetingItems.forEach((item, index) => {
            item.classList.add('meeting-enter');
            setTimeout(() => {
                item.classList.add('meeting-enter-active');
            }, 50 * index); 
        });


    }); 