import { dataCourses } from './dataCourses.js';
var coursesTbody = document.getElementById("courses");
var btnfilterByName = document.getElementById("button-filterByName");
var inputSearchBox = document.getElementById("search-box");
var totalCreditElm = document.getElementById("total-credits");
btnfilterByName.onclick = function () { return applyFilterByName(); }; //duda: por que no simplemente asignarle al evento "onclick" la funcion applyFilterByName()?
//asocia el evento con una
renderCoursesInTable(dataCourses);
totalCreditElm.innerHTML = "" + getTotalCredits(dataCourses);
function renderCoursesInTable(courses) {
    console.log('Desplegando cursos');
    courses.forEach(function (course) {
        var trElement = document.createElement("tr");
        trElement.innerHTML = "<td>" + course.name + "</td>\n                                <td>" + course.professor + "</td>\n                                <td>" + course.credits + "</td>";
        coursesTbody.appendChild(trElement);
    });
    //aqui lo hacen en un body vacio, pero puede hacerse un append al final del componente HTML anterior.
    //$(selector).action()
    //jQuery $: sign to define/access jQuery
    // A (selector) to "query HTML" elements
    //A jQuery action() to be performed on the element(s)
}
function applyFilterByName() {
    var text = inputSearchBox.value; // let text = inputSearchBox.value!<--?
    text = (text == null) ? '' : text;
    clearCoursesInTable();
    var coursesFiltered = searchCourseByName(text, dataCourses);
    renderCoursesInTable(coursesFiltered);
}
function searchCourseByName(nameKey, courses) {
    var courseStrings = [];
    var wantedCourse = [];
    if (nameKey === '') {
        wantedCourse = dataCourses;
    }
    else if (!nameKey.includes(",")) {
        wantedCourse = courses.filter(function (c) { return c.name.match(nameKey); });
    }
    else {
        courseStrings = nameKey.split(",");
        courses.sort((c1,c2) => c1.name.localeCompare(c2.name));
        console.log(courses);
        var _loop_1 = function (i) {
            var sCourse = courseStrings[i];
            var firstLetter = sCourse.split("")[0];
            courses.forEach(function (c) {
                if (c.name.startsWith(firstLetter) && c.name.localeCompare(sCourse) == 0)
                    wantedCourse.push(c);
                else if (c.name.split("")[0].localeCompare(firstLetter) > 0)
                    return;
            });
        };
        for (var i = 0; i < courseStrings.length; i++) {
            _loop_1(i);
        }
    }
    //return nameKey === '' ? dataCourses: courses.filter(c => c.name.match(nameKey));
    return wantedCourse;
}
function getTotalCredits(courses) {
    var totalCredits = 0;
    courses.forEach(function (course) { return totalCredits = totalCredits + course.credits; });
    //coursses.reduce((totalCredits,course)=> totalCredits+course.credits);
    return totalCredits;
}
function clearCoursesInTable() {
    while (coursesTbody.childElementCount > 0) { //si se use has childNodes se queda pegado en un loop infinito.
        if (coursesTbody.firstChild != null) {
            coursesTbody.removeChild(coursesTbody.firstChild);
        }
    }
}
