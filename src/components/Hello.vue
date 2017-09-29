<template>
  <div class='wrapper'>
    <nav id="sidebar">
      <div class="sidebar-header">
        <h3>Notes.app</h3>
      </div>
      <ul class="list-unstyled components" id="componentsNotesList">
        <li v-for="item in notes">
          <a v-on:click="showNote(item)" href="#">{{ item.markdown.substring(1,14) }}</a>
        </li>
      </ul>
    </nav>
    <div v-if="homeactive">
        <section class='topbar'>
            <div id='epicshelter'>
              <button class="btn btn-square btn-success" v-on:click="newNote">New Note</button>
            </div>
        </section>
        <section id="contentWindowArea">
          <div class='content-area minor-padding'>
            <h3>Hey all!</h3>
            <p>Welcome to Notes, a powerful note application that you can use whenever you want/need, built upon Vue.</p>
            <hr>
            <h3>Under the hood</h3>
            <p>
              Under the hood we're using Vue, lodash, marked, custom components to build this amazingly fast Vue app. The vue app uses localStorage to store/read/delete notes you've generated/created.
              <br>
              We're happy to use Bootstrap alongside custom flexbox container for our sidebar wrapper.
            </p>
            <hr>
            <a href="https://github.com/automicjs/notesapp" class='btn btn-square btn-lg btn-primary'>
              Fork, Contribute, Issues Live Here
            </a>
          </div>
        </section>
    </div>
    <div v-if="writingMode">
      <section class='topbar'>
          <div id='epicshelter'>
            <button class="btn btn-square btn-success" v-on:click="saveNote">Save Note</button> <button v-on:click="deleteNote" class="btn btn-square btn-danger">Delete Note</button> <button v-on:click="inlineNewNote" class="btn btn-square btn-info">New Note</button>
          </div>
      </section>
      <section id="contentWindowArea">
        <div class='row'>
          <div class='col-md-5 col-lg-5 col-sm-12 col-12'>
              <textarea id="mdEditorWindow" :value="input" @input="update"></textarea>
          </div>
          <div class='col-md-5 col-lg-5 col-sm-12 col-12'>
              <div id="compiledMarkdown" v-html="compiledMarkdown"></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import sidebar from './Sidebar'
export default {
  props: ['id'],
  name: 'hello',
  data () {
    return {
      homeactive: true,
      writingMode: false,
      input: '# hello, world!',
      note: {},
      noteIndex: -1,
      notes: this.$localStorage.get('notes')
    }
  },
  methods: {
    inlineNewNote: function () {
      if (this.note.markdown !== this.input) {
        if (confirm('Are you sure you wish to abandon unsaved changes and write a new note?')) {
          this.homeactive = false
          this.writingMode = true
          return
        }
      }
      if (this.note.markdown === this.input) {
        this.homeactive = false
        this.writingMode = true
      }
    },
    showNote: function (item) {
      this.note = item
      this.noteIndex = this.notes.findIndex(note => note.id === item.id)
      this.homeactive = false
      this.writingMode = true
      setTimeout(function () {
        document.getElementById('mdEditorWindow').innerHTML = this.note.markdown
      }.bind(this), 500)
    },
    newNote: function (event) {
      this.homeactive = false
      this.writingMode = true
    },
    saveNote: function (event) {
      const notes = this.$localStorage.get('notes')
      if (this.input !== '') {
        const note = Object.assign({}, this.note, {
          id: this.note.id || window.uuid(),
          timestamp: Date.now(),
          markdown: this.input
        })
        if (this.noteIndex >= 0) {
          notes[this.noteIndex] = note
        } else {
          notes.push(note)
        }
      } else if (this.noteIndex >= 0) {
        notes.splice(this.noteIndex, 1)
      }
      this.$localStorage.set('notes', notes)
      this.notes = this.$localStorage.get('notes')
      this.writingMode = false
      this.homeactive = true
    },
    deleteNote: function (event) {
      if (confirm('Delete note?')) {
        const notes = this.$localStorage.get('notes')
        const noteIndex = notes.findIndex(note => note.id === this.id)
        notes.splice(noteIndex, 1)
        this.$localStorage.set('notes', notes)
        this.notes = this.$localStorage.get('notes')
        this.writingMode = false
        this.homeactive = true
        this.input = '# hello, world!'
      }
    },
    loadNote: function () {
      const notes = this.$localStorage.get('notes')
      this.noteIndex = notes.findIndex(note => note.id === this.id)
      if (this.noteIndex >= 0) {
        this.note = notes[this.noteIndex]
      }
    },
    update: function (e) {
      this.input = document.getElementById('mdEditorWindow').value
    }
  },
  computed: {
    compiledMarkdown: function () {
      return window.marked(this.input, { sanitize: true })
    }
  },
  components: {
    sidebar
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn-square {
  border-radius:0px !important;
}
#mdEditorWindow {
  display: inline-block;
  width: 100%;
  height: 95vh;
  vertical-align: top;
  box-sizing: border-box;
  padding: 0 20px;
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: 'Monaco', courier, monoscape, sans-serif, serif;
  padding: 20px;
}
.content-area {
  padding: 3rem;
  font-size: 16px;
  font-family: 'Times New Roman', monospace, 'Poppins', sans-serif, serif;
}
.topbar {
  padding: 10px;
  background: #F3F3F2;
  width: 100%;
  min-width: 100vw;
}
.activetitle {
  font-weight: bold;
  text-transform: uppercase;
}
.wrapper {
  display: flex;
  align-items: stretch;
}
/* Notes Sidebar */

@import "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700";
p {
    font-family: 'Poppins', sans-serif;
    font-size: 1.1em;
    font-weight: 300;
    line-height: 1.7em;
    color: #999;
}

a, a:hover, a:focus {
    color: inherit;
    text-decoration: none;
    transition: all 0.3s;
}

#sidebar {
    /* don't forget to add all the previously mentioned styles here too */
    background: #26252A;
    color: #fff;
    transition: all 0.3s;
    min-width: 250px;
    max-width: 250px;
    min-height: 100vh;
    text-align: center;
}

#sidebar .sidebar-header {
    padding: 10px;
    background: #35343a;
}

#sidebar ul.components {
    padding: 20px 0;
    border-bottom: 1px solid #35343a;
}

#sidebar ul p {
    color: #fff;
    padding: 10px;
}

#sidebar ul li a {
    padding: 10px;
    font-size: 1.1em;
    display: block;
}
#sidebar ul li a:hover {
    color: #fff;
    background: #35343a;
}

#sidebar ul li.active > a, a[aria-expanded="true"] {
    color: #fff;
    background: #35343a;
}
ul ul a {
    font-size: 0.9em !important;
    padding-left: 30px !important;
    background: #35343a;
}
@media (max-width: 768px) {
    #sidebar {
        margin-left: -250px;
    }
    #sidebar.active {
        margin-left: 0;
    }
}
</style>
