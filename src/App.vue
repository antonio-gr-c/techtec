<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
}
</script>

<style>

@keyframes hero-gradient-animation {
    0% {
        --c-0: hsla(219.99999999999997, 90%, 15%, 1);
        --x-0: 57%;
        --y-0: 69%;
        --s-start-0: 8%;
        --s-end-0: 83%;
        --s-start-1: 1%;
        --s-end-1: 80%;
        --x-1: 98%;
        --y-1: 39%;
        --c-1: hsla(210.6122448979592, 92%, 20%, 1);
        --y-2: 56%;
        --x-2: 35%;
        --s-start-2: 12%;
        --s-end-2: 83%;
        --c-2: hsla(159, 48%, 49%, 1);
        --s-start-3: 18%;
        --s-end-3: 71%;
        --x-3: 70%;
        --c-3: hsla(214, 92%, 27%, 1);
        --y-3: 82%;
        --s-start-4: 6%;
        --s-end-4: 72%;
        --y-4: 84%;
        --c-4: hsla(219.99999999999997, 90%, 15%, 1);
        --x-4: 40%;
    }

    100% {
        --c-0: hsla(210, 92%, 20%, 1);
        --x-0: 69%;
        --y-0: 95%;
        --s-start-0: 14%;
        --s-end-0: 54%;
        --s-start-1: 7%;
        --s-end-1: 51%;
        --x-1: 70%;
        --y-1: 42%;
        --c-1: hsla(190, 62%, 47%, 1);
        --y-2: 1%;
        --x-2: 59%;
        --s-start-2: 13%;
        --s-end-2: 74%;
        --c-2: hsla(181, 83%, 12%, 1);
        --s-start-3: 15%;
        --s-end-3: 60%;
        --x-3: 10%;
        --c-3: hsla(219.99999999999997, 90%, 15%, 1);
        --y-3: 100%;
        --s-start-4: 9%;
        --s-end-4: 72%;
        --y-4: 76%;
        --c-4: hsla(159, 48%, 49%, 1);
        --x-4: 16%;
    }
}

@property --c-0 {
    syntax: '<color>';
    inherits: false;
    initial-value: hsla(219.99999999999997, 90%, 15%, 1)
}

@property --x-0 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 57%
}

@property --y-0 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 69%
}

@property --s-start-0 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 8%
}

@property --s-end-0 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 83%
}

@property --s-start-1 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 1%
}

@property --s-end-1 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 80%
}

@property --x-1 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 98%
}

@property --y-1 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 39%
}

@property --c-1 {
    syntax: '<color>';
    inherits: false;
    initial-value: hsla(210.6122448979592, 92%, 20%, 1)
}

@property --y-2 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 56%
}

@property --x-2 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 35%
}

@property --s-start-2 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 12%
}

@property --s-end-2 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 83%
}

@property --c-2 {
    syntax: '<color>';
    inherits: false;
    initial-value: hsla(159, 48%, 49%, 1)
}

@property --s-start-3 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 18%
}

@property --s-end-3 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 71%
}

@property --x-3 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 70%
}

@property --c-3 {
    syntax: '<color>';
    inherits: false;
    initial-value: hsla(214, 92%, 27%, 1)
}

@property --y-3 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 82%
}

@property --s-start-4 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 6%
}

@property --s-end-4 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 72%
}

@property --y-4 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 84%
}

@property --c-4 {
    syntax: '<color>';
    inherits: false;
    initial-value: hsla(219.99999999999997, 90%, 15%, 1)
}

@property --x-4 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 40%
}


#app {
  max-width: auto;
  margin: 0 auto;
  text-align: center;
  font-family: "Oxanium", sans-serif;
  font-optical-sizing: auto;
  font-weight: 200;
  font-style: normal;
  margin: 0;
  padding: 0;

  --c-0: hsla(219.99999999999997, 90%, 15%, 1);
    --x-0: 57%;
    --y-0: 69%;
    --x-1: 98%;
    --y-1: 39%;
    --c-1: hsla(210.6122448979592, 92%, 20%, 1);
    --y-2: 56%;
    --x-2: 35%;
    --c-2: hsla(159, 48%, 49%, 1);
    --x-3: 70%;
    --c-3: hsla(214, 92%, 27%, 1);
    --y-3: 82%;
    --y-4: 84%;
    --c-4: hsla(219.99999999999997, 90%, 15%, 1);
    --x-4: 40%;
    ;
    background-color: hsla(219, 90%, 15%, 1);
    background-image: radial-gradient(circle at var(--x-0) var(--y-0), var(--c-0) var(--s-start-0), transparent var(--s-end-0)), radial-gradient(circle at var(--x-1) var(--y-1), var(--c-1) var(--s-start-1), transparent var(--s-end-1)), radial-gradient(circle at var(--x-2) var(--y-2), var(--c-2) var(--s-start-2), transparent var(--s-end-2)), radial-gradient(circle at var(--x-3) var(--y-3), var(--c-3) var(--s-start-3), transparent var(--s-end-3)), radial-gradient(circle at var(--x-4) var(--y-4), var(--c-4) var(--s-start-4), transparent var(--s-end-4));
    animation: hero-gradient-animation 10s linear infinite alternate;
    background-blend-mode: normal, normal, normal, normal, normal;

}



 /* Chrome, Edge and Safari */
*::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
*::-webkit-scrollbar-track {
  border-radius: 18px;
  background-color: #474747;
}

*::-webkit-scrollbar-track:hover {
  background-color: #474747;
}

*::-webkit-scrollbar-track:active {
  background-color: #474747;
}

*::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: #041C4C;
}

*::-webkit-scrollbar-thumb:hover {
  background-color: #043466;
}

*::-webkit-scrollbar-thumb:active {
  background-color: #065D7D;
}

</style>