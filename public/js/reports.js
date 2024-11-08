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

});