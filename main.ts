import { dataCourses } from './dataCourses.js';
import { Course } from './course.js';

let coursesTbody: HTMLElement = document.getElementById("courses")!;
const btnfilterByName: HTMLElement = document.getElementById("button-filterByName")!;
const inputSearchBox: HTMLInputElement = <HTMLInputElement> document.getElementById("search-box")!;
const totalCreditElm: HTMLElement = document.getElementById("total-credits")!;

btnfilterByName.onclick = () => applyFilterByName(); //duda: por que no simplemente asignarle al evento "onclick" la funcion applyFilterByName()?
//asocia el evento con una

renderCoursesInTable(dataCourses);

totalCreditElm.innerHTML = `${getTotalCredits(dataCourses)}`

function renderCoursesInTable(courses: Course[]): void {
    console.log('Desplegando cursos');
    courses.forEach((course) => {
        let trElement = document.createElement("tr");
        trElement.innerHTML = `<td>${course.name}</td>
                                <td>${course.professor}</td>
                                <td>${course.credits}</td>`;
        coursesTbody.appendChild(trElement);
    }); 
    //aqui lo hacen en un body vacio, pero puede hacerse un append al final del componente HTML anterior.
    //$(selector).action()
    //jQuery $: sign to define/access jQuery
    // A (selector) to "query HTML" elements
    //A jQuery action() to be performed on the element(s)
}

function applyFilterByName(){
    let text = inputSearchBox.value; // let text = inputSearchBox.value!<--?
    text = (text == null)? '':text;
    clearCoursesInTable();
    let coursesFiltered: Course[] = searchCourseByName(text,dataCourses);
    renderCoursesInTable(coursesFiltered);
}
function searchCourseByName(nameKey: string, courses: Course[]):Course[]{
    let courseStrings: string[] = [];
    let wantedCourse: Course[] = [];
    if (nameKey === ''){
        wantedCourse = dataCourses;
    }
    else if (!nameKey.includes(",")){
        wantedCourse = courses.filter(c => c.name.match(nameKey));
    }
    else {
        courseStrings = nameKey.split(",");
        courses.sort((c1,c2) => c1.name.localeCompare(c2.name));
        console.log(courses);
        for(let i=0;i<courseStrings.length;i++){ //considerar implementar busqueda por Arbol binario rojo-negro RB-BST.
            let sCourse: string = courseStrings[i];
            let firstLetter: string = sCourse.split("")[0];
            courses.forEach(c => {
                if (c.name.startsWith(firstLetter) &&  c.name.localeCompare(sCourse) == 0)
                   wantedCourse.push(c);
                else if (c.name.split("")[0].localeCompare(firstLetter)>0)
                return;
            })
        }
    }
    //return nameKey === '' ? dataCourses: courses.filter(c => c.name.match(nameKey));
    return wantedCourse;
}
function getTotalCredits(courses: Course[]): number{
    let totalCredits: number = 0;
    courses.forEach((course)=> totalCredits = totalCredits+course.credits);
    //coursses.reduce((totalCredits,course)=> totalCredits+course.credits);
    return totalCredits;
}
function clearCoursesInTable(){
    while (coursesTbody.childElementCount>0){ //si se use has childNodes se queda pegado en un loop infinito.
        if (coursesTbody.firstChild!=null){
            coursesTbody.removeChild(coursesTbody.firstChild);
        }
    }
}