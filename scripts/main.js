import { dataStundent } from './dataStudent.js';
import { dataCourses } from './dataCourses.js';
var coursesTbody = document.getElementById("courses");
var personalDtaTBody = document.getElementById("personalData");
var btnfilterByName = document.getElementById("button-filterByName");
var btnfilterByCredits = document.getElementById("button-filterByCredits");
var inputSearchBox = document.getElementById("search-box");
var inputMinBox = document.getElementById("min-search-box");
var inputMaxBox = document.getElementById("max-search-box");
var totalCreditElm = document.getElementById("total-credits");
btnfilterByName.onclick = function () { return applyFilterByName(); }; //duda: por que no simplemente asignarle al evento "onclick" la funcion applyFilterByName()?
btnfilterByCredits.onclick = function () { return applyFilterByCredits(); };
//asocia el evento con una
renderPersonalData(dataStundent); //llamar al render de personalData
renderCoursesInTable(dataCourses);
totalCreditElm.innerHTML = "" + getTotalCredits(dataCourses);
function renderPersonalData(student) {
    console.log('Desplegando info del estudiante');
    for (var _i = 0, _a = Object.entries(student); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        console.log(key + ':' + value);
        var trElement = document.createElement("tr");
        trElement.innerHTML = "<td>" + key + "</td>\n                               <td>" + value + "</td>";
        personalDtaTBody.appendChild(trElement);
    }
}
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
function applyFilterByCredits() {
    var min = parseInt(inputMinBox.value);
    var max = parseInt(inputMaxBox.value);
    var courses = dataCourses;
    var coursesFiltered = [];
    min = (min == null) ? 0 : min;
    max = (max == null) ? getTotalCredits(dataCourses) : max;
    clearCoursesInTable();
    courses.sort(function (c1, c2) {
        if (c1.credits > c2.credits)
            return 1;
        else if (c1.credits < c2.credits)
            return -1;
        else
            return 0;
    });
    var minIndex = searchIndexOfCredits(min, 0, courses.length - 1, courses);
    var maxIndex = searchIndexOfCredits(max, 0, courses.length - 1, courses);
    for (var i = minIndex; i <= maxIndex; i++) {
        coursesFiltered.push(courses[i]);
    }
    renderCoursesInTable(coursesFiltered);
}
function searchIndexOfCredits(target, lo, hi, sortedCourses) {
    var mid = Math.floor((hi / 2) + lo);
    if (mid == sortedCourses.length)
        --mid;
    if (target > sortedCourses[mid].credits)
        return searchIndexOfCredits(target, mid, hi, sortedCourses);
    else if (target < sortedCourses[mid].credits)
        return searchIndexOfCredits(target, lo, mid, sortedCourses);
    else
        return mid;
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
        courses.sort(function (c1, c2) { return c1.name.localeCompare(c2.name); });
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
