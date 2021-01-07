$(document).ready(function () {
    // DOM Variables
    const submitBtnEl = $('#submit');
    const addInstBtnEl = $('#add-instructions');
    const titleEl = $('#title');
    const descriptionEl = $('#description');
    const video_linkEl = $('#video_link');
    const stepsDiv = $('.steps');
    const instructionsDivEl = $('#instructions');

    // functions
    async function createDesign(newDesign) {
        try {
            const result = await $.ajax({
                url: '/api/design',
                data: newDesign,
                method: 'POST',
            });

            if (result.message === 'Design added!') {
                window.location = `/edit/${result.id}`;
            } else {
                alert('Design may not have been added, please check your profile page to be sure')
            }

        } catch (err) {
            console.log(err);
        }
    }

    // click events
    addInstBtnEl.on('click', (e) => {
        e.preventDefault();
        instructionsDivEl.append('<div class="steps"><input type="number" class="sequence" value=""><div class="mt-1"><textarea id="instruction"  rows="1" class="description shadow-sm focus:ring-sage focus:border-sage mt-1 block w-full sm:text-sm border-gray-300 rounded-md"placeholder="Add instruction"></textarea></div></div>');
    })


    submitBtnEl.on('click', (e) => {
        e.preventDefault();

        const newDesign = {
            title: titleEl.val().trim(),
            description: descriptionEl.val().trim(),
            video_link: video_linkEl.val().trim(),
        }
        createDesign(newDesign);
    })
});