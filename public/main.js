const checks = document.querySelectorAll('ul.apps li label')
const title = document.querySelector('div.container h1.title')
const subtitle = document.querySelector('div.container h2.subtitle')
const apps = []

console.log(window.navigator.oscpu)

checks.forEach((currentValue) => { // Checkbox checking
    currentValue.addEventListener('change', () => {
        if (currentValue.children[0].checked) {
            apps.push(currentValue.children[2].innerHTML)
            title.innerHTML = apps
        } else {
            apps.pop(currentValue.children[2].innerHTML)
            title.innerHTML = apps
        }
    })
})
