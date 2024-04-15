const forms = document.querySelectorAll(".forms")
const nextButton = document.querySelector(".next-button")
const backButton = document.querySelector(".back-button")
const buttons = document.querySelector(".buttons")
const form1 = document.querySelectorAll(".form1 form input")
const form2 = document.querySelectorAll(".pricing-container .card")
const form3 = document.querySelector(".form3")
const form4 = document.querySelector(".form4")
const form2Slider = document.querySelector(".slider")
const planCharge = document.querySelectorAll(".plan-charge")
const changePlan = document.querySelector(".change-plan")
const addOns = document.querySelectorAll(".add-ons-container .add-on")
const formNumbers = document.querySelectorAll(".form-number .number")
const formNumbersDesktop = document.querySelectorAll(".form-number-desktop .number")

let currentForm = 0;

let summary = {
    planName: "",
    planDuration: "",
    planPrice: "",
    planAddOns: []
}


changePlan.addEventListener("click", () => {
    forms[currentForm].classList.add("hidden")
    currentForm = 1
    displayForm()
})

function highlightNumber() {
    let desktopOrMobile = window.innerWidth > 600 ? formNumbersDesktop : formNumbers

    desktopOrMobile.forEach((number, index) => {
        number.classList.toggle("highlight-number", index === currentForm);
    });

    if (currentForm === forms.length - 1) {
        desktopOrMobile.forEach((number) => {
            number.textContent = "✔"
            number.classList.add("highlight-number")
        })
    }
}

function disableBackButton() {
    backButton.disabled = currentForm === 0;
    backButton.style.cursor = currentForm === 0 ? "not-allowed" : "pointer";
}

function displayForm() {
    forms[currentForm].classList.remove("hidden")
    highlightNumber()
    disableBackButton()

    if (currentForm === forms.length - 1) {
        buttons.classList.add("hidden")
    }


    if (currentForm === 2) {
        if (summary.planDuration === "Yearly") {
            addOns.forEach((addOn) => {
                const addOnPrice = addOn.querySelector(".addOn-right p")
                if (addOnPrice.textContent.includes("mo")) {
                    addOnPrice.textContent = `+${parseFloat(addOnPrice.textContent) * 10}/yr`
                }
            })
        } else {
            addOns.forEach((addOn) => {
                const addOnPrice = addOn.querySelector(".addOn-right p")
                if (addOnPrice.textContent.includes("yr")) {
                    addOnPrice.textContent = `+${parseFloat(addOnPrice.textContent) / 10}/mo`
                }
            })
        }
    }

    if (currentForm === 3) {
        const planName = form4.querySelector(".planName");
        const planPrice = form4.querySelector(".planPrice");
        const summaryAddOnContainer = form4.querySelector(".summary-addons-container");
        const totalPrice = form4.querySelector(".summary-total");
        let total = parseFloat(summary.planPrice.split("$")[1].split("/")[0]);

        nextButton.textContent = "Confirm";

        planName.textContent = `${summary.planName}(${summary.planDuration})`;
        planPrice.textContent = summary.planPrice;

        summaryAddOnContainer.innerHTML = "";

        if (summary.planAddOns.length === 0) {
            const noaddOnEl = document.createElement("h5");
            noaddOnEl.classList = "no-addOn";
            noaddOnEl.textContent = "No add Ons";
            summaryAddOnContainer.appendChild(noaddOnEl);
        } else {
            total += summary.planAddOns.reduce((acc, addon) => acc + parseFloat(addon.addOnPrice), 0);

            summary.planAddOns.forEach((addon) => {
                const addOnContainer = document.createElement("div");
                addOnContainer.classList.add("summary-addOns");
                addOnContainer.innerHTML = `<div><p>${addon.addOnName}</p></div><p>${addon.addOnPrice}</p>`;
                summaryAddOnContainer.appendChild(addOnContainer);
            });
        }

        const period = summary.planDuration === "Yearly" ? "yr" : "mo";
        totalPrice.firstElementChild.textContent = `Total (per ${period})`;
        totalPrice.lastElementChild.textContent = `$${total}/${period}`;
    }

}

displayForm()

function validateForm1() {
    let isEmailCorrect;
    let isNumberCorrect;
    form1.forEach((input) => {
        if (!input.value) {
            input.nextElementSibling.textContent = "This field is required"
        } else {
            input.nextElementSibling.textContent = ""

            if (input.getAttribute("type") === "email") {
                const pattern = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
                isEmailCorrect = pattern.test(input.value)
                if (!isEmailCorrect) input.nextElementSibling.textContent = "Invalid email"

            }
            if (input.getAttribute("type") === "number") {
                if (input.value.length === 10) {
                    isNumberCorrect = true
                } else {
                    input.nextElementSibling.textContent = "Enter exactly 10 digits."
                    isNumberCorrect = false
                }
            }

            if (form1[0].value && form1[1].value && form1[2].value && isEmailCorrect && isNumberCorrect) {
                form1[0].nextElementSibling.textContent = ""
                form1[1].nextElementSibling.textContent = ""
                form1[2].nextElementSibling.textContent = ""
                forms[currentForm].classList.add("hidden")
                currentForm++
                displayForm()

            }

        }

    }
    )

}

form2.forEach(card => {
    card.addEventListener("click", () => {
        form2.forEach(c => c.classList.remove("card-selected"));
        card.classList.add("card-selected");
    });
});


form2Slider.addEventListener("click", (e) => {
    let YearOrMonth = e.target.previousElementSibling.checked;
    summary.planAddOns = []

    addOns.forEach((addOn) => {
        const checkbox = addOn.querySelector("input")
        addOn.classList.remove("addOn-selected")
        checkbox.checked = false
    })

    planCharge.forEach((charge) => {
        const chargeValue = charge.textContent.split("/")[0].split("$")[1]
        charge.textContent = YearOrMonth ? `$ ${chargeValue / 10}/mo` : `$ ${chargeValue * 10}/yr`
    })
})

function validateForm2() {
    form2.forEach((card) => {
        if (card.classList.contains("card-selected")) {
            const planName = card.querySelector(".card-content h3").textContent
            const planPrice = card.querySelector(".card-content p:first-of-type").textContent
            summary.planName = planName
            summary.planPrice = planPrice
            summary.planDuration = planPrice.includes("yr") ? "Yearly" : "Monthly"
            forms[currentForm].classList.add("hidden")
            currentForm++
            displayForm()
        }
    })

}

addOns.forEach((addOn) => {
    const checkbox = addOn.querySelector("input")
    const addOnName = addOn.querySelector(".add-on-content h4")
    const addOnPrice = addOn.querySelector(".addOn-right p")

    addOn.addEventListener(("click"), (e) => {
        if (addOn.classList.contains("addOn-selected")) {
            addOn.classList.remove("addOn-selected");
            let filteredSummaryAddons = summary.planAddOns.filter((a) => a.addOnName !== addOnName.textContent)
            summary.planAddOns = filteredSummaryAddons

        } else {
            addOn.classList.add("addOn-selected");
            summary.planAddOns.push({ addOnName: addOnName.textContent, addOnPrice: addOnPrice.textContent })
        }

        checkbox.checked = !checkbox.checked;

    })
    checkbox.addEventListener(("click"), (e) => {
        e.stopPropagation()
        addOn.classList.toggle("addOn-selected")
    })
})


function validateForm3() {
    forms[currentForm].classList.add("hidden")
    currentForm++
    displayForm()

}

function validateForm4() {
    forms[currentForm].classList.add("hidden")
    currentForm++
    displayForm()
}

function validateForm(e) {

    switch (currentForm) {
        case 0: validateForm1()
            break;

        case 1: validateForm2()
            break;

        case 2: validateForm3()
            break;

        case 3: validateForm4()
            break;

        default:
            break;
    }

}

function displayNextForm() {
    validateForm()
}

function displayPreviousForm() {
    forms[currentForm].classList.add("hidden")
    currentForm--;
    forms[currentForm].classList.remove("hidden")
    disableBackButton()
    highlightNumber()
}



nextButton.addEventListener("click", displayNextForm)
backButton.addEventListener("click", displayPreviousForm)
