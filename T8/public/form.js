function plus() {
    const div = document.getElementById("multi-file")

    div.innerHTML += `
        <hr/>

        <div class="w3-row w3-margin-bottom">
            <div class="w3-col s3">
                <label class="w3-text-teal">Description</label>
            </div>
            
            <div class="w3-col s9 w3-border">
                <input class="w3-input w3-border w3-light-grey" type="text" name="desc"/>
            </div>
        </div>
        
        <div class="w3-row w3-margin-bottom">
            <div class="w3-col s3">
                <label class="w3-text-teal">Select file</label>
            </div>
            
            <div class="w3-col s9 w3-border">
                <input class="w3-input w3-border w3-light-grey" type="file" name="myFile"/>
            </div>
        </div>`
}
