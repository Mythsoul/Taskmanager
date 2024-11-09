document.addEventListener('DOMContentLoaded', () => {
 
    const add_report_btn = document.getElementById("add_report_btn");
    const add_report_dialog = document.getElementById("add_report_dialog");
    const add_report_form = document.getElementById("report_form");
    
    add_report_btn.addEventListener("click"  , async()=>{ 
        add_report_dialog.showModal();  
    
    }); 
    
    add_report_form.addEventListener("submit" , async()=>{ 
        const reportTitle = document.getElementById("report_name").value;
        const reportDescription = document.getElementById("report_description").value;
        const report = {
            report_name : reportTitle,
            report_description : reportDescription
        };
        const response = await fetch("/createreport", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(report)
        });
        if (response.ok) {
            alert(response.json().message);
            add_report_dialog.close();
        }else{
            alert(response.json().message);
        }
    });

const edit_report_btns = document.querySelectorAll("#edit-report-btn");
    const edit_report_dialog = document.getElementById("updateReportDialog");
    const edit_report_form = document.getElementById("updateReportForm");
    const close_report_dialog = document.getElementById("cancel_report_update");
    let report_id = null;

    edit_report_btns.forEach((btn) => {
        btn.addEventListener("click", async () => {
            report_id = btn.getAttribute("data-report-id");
        edit_report_dialog.showModal();
        })
    }); 
    edit_report_form.addEventListener("submit", async () => {
        const reportTitle = document.getElementById("updatereportTitle").value;
        const reportDescription = document.getElementById("updatereportDescription").value;
        const report = {
            report_id,
            report_title: reportTitle,
            report_description: reportDescription
        };
        const response = await fetch("/updatereport", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(report)
        });
        if (response.ok) {
            alert(response.json().message);
            edit_report_dialog.close();
        }else{
            alert(response.json().message);
        }
    });
    close_report_dialog.addEventListener("click", () => {   
        edit_report_dialog.close();
    }); 

    async function delete_report(){ 
    const delete_report_btn = document.querySelectorAll("#delete-report-btn");
   delete_report_btn.forEach((btn) => {
    btn.addEventListener("click" ,  async() => {
        const report_id = btn.getAttribute("data-report-id");
        const response = await fetch("/deletereport", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ report_id })
        });
        if (response.ok) {
            alert(response.json().message);
            window.location.reload();
        }else{
            alert(response.json().message);
        }
    }); 
   }); 
};
delete_report();
    });
