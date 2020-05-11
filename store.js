const tableID = "appSF4u3aLqrtbzJ8";
const apikey = "keyoQpvlH7D3w9kIB"; //normally this should NEVER be exposed. However, this api key is to an account that has read-only access to publicly viewable airtables.
const tableview = "Grid%20view";
const workApiUrl = `https://api.airtable.com/v0/${tableID}/Work?api_key=${apikey}&view=${tableview}`;
const studentsApiUrl = `https://api.airtable.com/v0/${tableID}/Students?api_key=${apikey}&view=${tableview}`;
const documentsApiUrl = `https://api.airtable.com/v0/${tableID}/Documents?api_key=${apikey}&view=${tableview}`;

 
 // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export const store = new Vuex.Store({
    state: {
        students: [],
        works: [],
        documents: {},
        workThemes: [],
        hasLoaded: false,
        shuffleIndex: 0,
    },
    getters: {
        studentsWithWork: state => {
            const workIds = state.works.map(w => w.id)
            const students = state.students
            return students.filter(s => {
                const studentWorks = s.fields['Work']
                const worksForStudent = studentWorks.filter(w => workIds.includes(w))
                return worksForStudent.length > 0
            })
        }
    },
    mutations: {
        setStudents(state, students) {
            state.students = students;
        },
        setWorks(state, works) {
            state.works = works;
            const themes = [];
            let i = 0;
            state.works.forEach(work => {
                const themeWeek = work.fields["Theme / Week"]
                if (themeWeek && themeWeek.length) {
                    themes.push(themeWeek[(state.shuffleIndex + i) % themeWeek.length])
                }
                i++;
            });
            state.workThemes = themes;
        },
        setDocuments(state, documents) {
            state.documents = documents
        },
        updateThemes(state) {
            const themes = [];
            state.works.forEach(work => {
                const themeWeek = work.fields["Theme / Week"]
                if (themeWeek && themeWeek.length) {
                    themes.push(themeWeek[state.shuffleIndex % themeWeek.length])
                }
            });
            state.workThemes = themes;
        },
        setLoaded(state) {
            state.hasLoaded = true;
        },
        setWorkThemes(state, workThemes) {
            state.workThemes = workThemes;
        },
        incrementShuffle(state) {
            state.shuffleIndex++;
        }
    },
    actions: {
        incrementShuffle(context) {
            context.commit('incrementShuffle');
            context.commit('updateThemes');
        },
        shuffle(context) {
            console.log('shuffling');
            context.commit('incrementShuffle');
            let works = [...context.state.works]
            shuffle(works)
            context.commit('setWorks', works)
            let students = [...context.state.students]
            shuffle(students)
            context.commit('setStudents', students)
        },
        fetch(context) {
            if (!context.state.hasLoaded) {
                context.dispatch('fetchStudentsAndWorks');
            }
        },
        fetchStudentsAndWorks(context) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", workApiUrl);
            xhr.onload = function () {
                let works = JSON.parse(xhr.responseText).records.filter(w => !w.fields['Please don\'t share'])
                context.commit(
                    "setWorks",
                    shuffle(works)
                );
            };
            xhr.send();
            var xhr2 = new XMLHttpRequest();
            xhr2.open("GET", studentsApiUrl);
            xhr2.onload = function () {
                const students = shuffle(JSON.parse(xhr2.responseText).records.filter(s => s.fields['Work']))
                context.commit(
                    "setStudents",
                    students
                );
            };
            xhr2.send();
            var xhr3 = new XMLHttpRequest();
            xhr3.open("GET", documentsApiUrl);
            xhr3.onload = function () {
                const rawDocs = JSON.parse(xhr3.responseText).records
                const docs = {}
                rawDocs.forEach(doc => {
                    docs[doc.fields['Name']] = doc.fields
                })
                context.commit(
                    "setDocuments",docs
                );
            };
            xhr3.send();
            context.commit('setLoaded')
        }
    }
})