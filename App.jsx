import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Flame, Scroll, Crown, Trophy, ChevronRight, RotateCcw, Play, Sparkles,
  Sailboat, Tent, Star, Users, BookOpen, Lock, Coins, Gem, X, Gift, ShoppingBag, Check,
  Volume2, VolumeX, Music
} from "lucide-react";
import {
  loadMutePref, isMuted, toggleMuted,
  playClick, playCorrect, playWrong, playLevelComplete, playGameOver, playCoin,
  loadMusicPref, isMusicEnabled, toggleMusicEnabled, startMusic, stopMusic
} from "./sound";

/* ------------------------------------------------------------------ */
/* DATA — 8 niveles, cada uno un gran tramo de la historia bíblica     */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  {
    id: "origenes",
    name: "Génesis: Orígenes",
    subtitle: "La Creación · Adán y Eva · Caín y Abel",
    icon: Sparkles,
    accent: "#C9A227",
    scene: "origenes",
    questions: [
      { q: "¿Qué dijo Dios el primer día de la creación antes de que existiera la luz?", options: ["\"Sea la luz\"", "\"Sean las aguas\"", "\"Sea el firmamento\"", "\"Sea la tierra\""], correct: 0, ref: "Génesis 1:3" },
      { q: "¿De qué material formó Dios al primer hombre?", options: ["Barro cocido", "Polvo de la tierra", "Piedra", "Arena del desierto"], correct: 1, ref: "Génesis 2:7" },
      { q: "¿De dónde tomó Dios el material para formar a la mujer?", options: ["Del polvo de la tierra", "De una costilla del hombre", "De barro del Edén", "De una flor del jardín"], correct: 1, ref: "Génesis 2:22" },
      { q: "¿Qué ofrenda presentó Caín a Dios?", options: ["Un cordero", "Los primogénitos de su rebaño", "Frutos de la tierra", "Aceite y vino"], correct: 2, ref: "Génesis 4:3" },
      { q: "¿Cuál era el oficio de Abel?", options: ["Labrador de la tierra", "Pastor de ovejas", "Constructor", "Cazador"], correct: 1, ref: "Génesis 4:2" },
      { q: "¿Qué marca puso Dios sobre Caín después de su castigo?", options: ["Una señal para que nadie lo matara", "Una mancha en la frente", "Ninguna, quedó invisible", "Una cicatriz en la mano"], correct: 0, ref: "Génesis 4:15" },
      { q: "¿Qué fruto del árbol prohibido comieron Adán y Eva según la tradición?", options: ["La Biblia no especifica la fruta", "Una manzana", "Un higo", "Una granada"], correct: 0, ref: "Génesis 3:6" },
      { q: "¿Qué serpiente engañó a Eva en el jardín del Edén?", options: ["Una serpiente cualquiera del jardín", "La serpiente sagrada del río", "Un dragón alado", "Ninguna, fue un ángel caído visible"], correct: 0, ref: "Génesis 3:1" },
      { q: "¿Con qué cubrieron Adán y Eva su desnudez después de pecar?", options: ["Pieles de animales", "Hojas de higuera", "Lana de oveja", "Nada, permanecieron desnudos"], correct: 1, ref: "Génesis 3:7" },
      { q: "¿En qué región se establecieron los descendientes de Caín tras su destierro?", options: ["Tierra de Nod", "Tierra de Canaán", "Tierra de Uz", "Tierra de Harán"], correct: 0, ref: "Génesis 4:16" },
      { q: "¿Qué día de la creación descansó Dios de toda su obra?", options: ["El quinto día", "El sexto día", "El séptimo día", "No descansó"], correct: 2, ref: "Génesis 2:2" },
      { q: "¿Qué nombre le puso Adán a la mujer?", options: ["Eva", "Lilith", "Vida", "Gracia"], correct: 0, ref: "Génesis 3:20" },
      { q: "¿Cuántos ríos salían del Edén para regar el jardín?", options: ["Dos", "Tres", "Cuatro", "Cinco"], correct: 2, ref: "Génesis 2:10" },
      { q: "¿Qué le preguntó Dios a Caín después de que este matara a Abel?", options: ["\"¿Dónde está tu hermano?\"", "\"¿Qué has hecho?\"", "\"¿Por qué te has enojado?\"", "\"¿Dónde estás tú?\""], correct: 0, ref: "Génesis 4:9" },
      { q: "¿Cuántos años vivió Matusalén, el hombre más longevo de la Biblia?", options: ["777 años", "969 años", "930 años", "500 años"], correct: 1, ref: "Génesis 5:27" },
    ],
  },
  {
    id: "diluvio",
    name: "El Diluvio",
    subtitle: "Noé · El Arca · La Nueva Alianza",
    icon: Sailboat,
    accent: "#5E8A7E",
    scene: "diluvio",
    questions: [
      { q: "¿De qué madera construyó Noé el arca?", options: ["Madera de olivo", "Madera de cedro", "Madera de gofer", "Madera de acacia"], correct: 2, ref: "Génesis 6:14" },
      { q: "¿Cuántos días y noches llovió sobre la tierra?", options: ["7 días y 7 noches", "40 días y 40 noches", "100 días y 100 noches", "365 días"], correct: 1, ref: "Génesis 7:12" },
      { q: "¿Qué ave envió Noé primero para saber si las aguas habían bajado?", options: ["Una paloma", "Un cuervo", "Un águila", "Una golondrina"], correct: 1, ref: "Génesis 8:7" },
      { q: "¿Qué señal puso Dios en el cielo como pacto de no volver a destruir la tierra con agua?", options: ["Una estrella", "El arco iris", "Una nube blanca", "El sol al mediodía"], correct: 1, ref: "Génesis 9:13" },
      { q: "¿Qué plantó Noé después del diluvio?", options: ["Un olivo", "Trigo", "Una viña", "Higueras"], correct: 2, ref: "Génesis 9:20" },
      { q: "¿Cuál de los hijos de Noé vio la desnudez de su padre y fue maldecido en su descendencia?", options: ["Sem", "Jafet", "Cam", "Set"], correct: 2, ref: "Génesis 9:22-25" },
      { q: "¿Cuántas personas entraron en total al arca de Noé?", options: ["4", "6", "8", "12"], correct: 2, ref: "Génesis 7:13" },
      { q: "¿Cuántos animales puros de cada especie debía llevar Noé al arca?", options: ["Dos", "Siete parejas", "Uno", "Cuatro"], correct: 1, ref: "Génesis 7:2" },
      { q: "¿En qué monte reposó el arca cuando bajaron las aguas?", options: ["Monte Ararat", "Monte Sinaí", "Monte Carmelo", "Monte Nebo"], correct: 0, ref: "Génesis 8:4" },
      { q: "¿Qué edad tenía Noé cuando comenzó el diluvio?", options: ["500 años", "600 años", "700 años", "900 años"], correct: 1, ref: "Génesis 7:6" },
      { q: "¿Cuántos pisos tenía el arca de Noé?", options: ["Uno", "Dos", "Tres", "Cuatro"], correct: 2, ref: "Génesis 6:16" },
      { q: "¿Qué usó Noé para cubrir el arca por dentro y por fuera?", options: ["Brea", "Cera de abeja", "Aceite de oliva", "Resina de cedro"], correct: 0, ref: "Génesis 6:14" },
      { q: "¿Qué llevó de vuelta la paloma en su segundo vuelo, señal de que las aguas bajaban?", options: ["Una rama de olivo", "Una rama de higuera", "Un grano de trigo", "Nada, regresó vacía"], correct: 0, ref: "Génesis 8:11" },
      { q: "¿Cuántos días esperó Noé antes de enviar por primera vez al cuervo y la paloma?", options: ["40 días", "7 días", "100 días", "150 días"], correct: 0, ref: "Génesis 8:6" },
      { q: "¿Qué mandato le dio Dios a Noé y su familia al salir del arca?", options: ["Fructificad y multiplicaos", "Construid una ciudad", "Ofreced sacrificio diario", "Buscad tierra nueva"], correct: 0, ref: "Génesis 9:1" },
    ],
  },
  {
    id: "patriarcas",
    name: "Los Patriarcas",
    subtitle: "Abraham · Jacob · José",
    icon: Tent,
    accent: "#8A6A3B",
    scene: "patriarcas",
    questions: [
      { q: "¿Cómo se llamaba Abraham antes de que Dios cambiara su nombre?", options: ["Abram", "Isaí", "Taré", "Nacor"], correct: 0, ref: "Génesis 17:5" },
      { q: "¿A quién le pidió Dios a Abraham que ofreciera en sacrificio en el monte Moriah?", options: ["A Ismael", "A Isaac", "A Lot", "A un cordero del rebaño"], correct: 1, ref: "Génesis 22:2" },
      { q: "¿Con quién luchó Jacob toda una noche junto al río Jaboc?", options: ["Con su hermano Esaú", "Con un ángel", "Con un león", "Con su suegro Labán"], correct: 1, ref: "Génesis 32:24" },
      { q: "¿Qué nuevo nombre recibió Jacob después de aquella lucha?", options: ["Israel", "Judá", "Efraín", "Benjamín"], correct: 0, ref: "Génesis 32:28" },
      { q: "¿Qué prenda le dio Jacob a José que despertó la envidia de sus hermanos?", options: ["Una espada", "Una túnica de colores", "Un cinturón de cuero", "Un báculo de pastor"], correct: 1, ref: "Génesis 37:3" },
      { q: "¿A qué puesto llegó José en Egipto tras interpretar los sueños del faraón?", options: ["Sumo sacerdote", "Gobernador de Egipto", "Capitán del ejército", "Escriba real"], correct: 1, ref: "Génesis 41:41" },
      { q: "¿De dónde salió Abraham cuando Dios lo llamó a una tierra desconocida?", options: ["Ur de los caldeos", "Egipto", "Babilonia", "Nínive"], correct: 0, ref: "Génesis 11:31" },
      { q: "¿Cómo se llamaba la esposa de Abraham?", options: ["Rebeca", "Sara", "Lea", "Raquel"], correct: 1, ref: "Génesis 17:15" },
      { q: "¿Qué vendieron los hermanos de José a unos mercaderes que pasaban?", options: ["A José mismo", "El ganado de su padre", "Su túnica de colores", "Sus tierras"], correct: 0, ref: "Génesis 37:28" },
      { q: "¿Cuántos años sirvió Jacob a Labán para poder casarse con Raquel?", options: ["7 años", "14 años en total", "3 años", "20 años"], correct: 1, ref: "Génesis 29:27-30" },
      { q: "¿Cómo se llamaba el sobrino de Abraham que lo acompañó desde Ur?", options: ["Lot", "Nacor", "Eliezer", "Ismael"], correct: 0, ref: "Génesis 12:4-5" },
      { q: "¿Qué ciudades fueron destruidas por su maldad mientras Lot vivía allí?", options: ["Sodoma y Gomorra", "Nínive y Babel", "Jericó y Hai", "Tiro y Sidón"], correct: 0, ref: "Génesis 19:24-25" },
      { q: "¿Con qué se sustituyó a Isaac en el altar del sacrificio?", options: ["Un carnero trabado en un matorral", "Una paloma", "Nada, Dios detuvo la mano de Abraham sin sustituto", "Un cordero recién nacido"], correct: 0, ref: "Génesis 22:13" },
      { q: "¿Por qué plato de lentejas vendió Esaú su primogenitura a Jacob?", options: ["Un guiso rojo de lentejas", "Pan y miel", "Carne asada", "Vino y uvas"], correct: 0, ref: "Génesis 25:30-34" },
      { q: "¿Quién interpretó los sueños de José en la cárcel de Egipto que luego se cumplieron?", options: ["José mismo", "El faraón", "Un ángel", "El copero real"], correct: 0, ref: "Génesis 40:12-19" },
    ],
  },
  {
    id: "exodo",
    name: "Éxodo: El Libertador",
    subtitle: "Moisés · El Mar Rojo · El Maná",
    icon: Flame,
    accent: "#B0592F",
    scene: "exodo",
    questions: [
      { q: "¿En qué fue colocado el bebé Moisés para salvarlo de la muerte?", options: ["Una cesta de juncos", "Una canasta de madera", "Una vasija de barro", "Una balsa de troncos"], correct: 0, ref: "Éxodo 2:3" },
      { q: "¿Cómo se le reveló Dios a Moisés en el monte Horeb?", options: ["En un torbellino", "En una zarza que ardía sin consumirse", "En una nube de fuego", "En un sueño"], correct: 1, ref: "Éxodo 3:2" },
      { q: "¿Cuántas plagas envió Dios sobre Egipto antes de la liberación?", options: ["7", "10", "12", "3"], correct: 1, ref: "Éxodo 7-12" },
      { q: "¿Qué hizo Moisés para abrir camino a través del Mar Rojo?", options: ["Oró en silencio", "Extendió su mano y su vara sobre el mar", "Golpeó una roca", "Encendió una hoguera"], correct: 1, ref: "Éxodo 14:21" },
      { q: "¿Cómo se llamaba el alimento que Dios envió del cielo en el desierto?", options: ["Codorniz", "Maná", "Miel del desierto", "Pan de cebada"], correct: 1, ref: "Éxodo 16:15" },
      { q: "¿Dónde recibió Moisés los Diez Mandamientos?", options: ["Monte Sinaí", "Monte Nebo", "Monte Carmelo", "Monte Horeb"], correct: 0, ref: "Éxodo 19:20" },
      { q: "¿Quién era el hermano de Moisés que le servía de portavoz ante el faraón?", options: ["Aarón", "Josué", "Caleb", "Coré"], correct: 0, ref: "Éxodo 4:16" },
      { q: "¿Qué becerro de metal fabricó el pueblo mientras Moisés estaba en el monte?", options: ["Un becerro de oro", "Un carnero de plata", "Un toro de bronce", "Una serpiente de cobre"], correct: 0, ref: "Éxodo 32:4" },
      { q: "¿Cuántos años vagó el pueblo de Israel por el desierto antes de llegar a la tierra prometida?", options: ["10 años", "20 años", "40 años", "70 años"], correct: 2, ref: "Números 14:33" },
      { q: "¿Qué última plaga convenció al faraón de dejar salir al pueblo de Israel?", options: ["Granizo", "Oscuridad", "Muerte de los primogénitos", "Langostas"], correct: 2, ref: "Éxodo 12:29-30" },
      { q: "¿Qué fiesta instituyó Dios para recordar la salida de Egipto?", options: ["La Pascua", "Los Tabernáculos", "Pentecostés", "El Día de Expiación"], correct: 0, ref: "Éxodo 12:14" },
      { q: "¿Qué guiaba al pueblo de Israel de día en el desierto?", options: ["Una columna de nube", "Una estrella", "Un ángel visible", "El sonido de trompetas"], correct: 0, ref: "Éxodo 13:21" },
      { q: "¿Cómo se llamaba la hermana de Moisés que vigiló la cesta en el río?", options: ["Miriam", "Séfora", "Débora", "Rebeca"], correct: 0, ref: "Éxodo 2:4" },
      { q: "¿Con qué endulzó Moisés las aguas amargas de Mara?", options: ["Con un árbol que Dios le mostró", "Con sal", "Con miel", "Con aceite"], correct: 0, ref: "Éxodo 15:25" },
      { q: "¿Cuántos mandamientos contenían las tablas de piedra dadas a Moisés?", options: ["Diez", "Doce", "Siete", "Cinco"], correct: 0, ref: "Éxodo 20" },
    ],
  },
  {
    id: "jueces_reyes",
    name: "Jueces y Reyes",
    subtitle: "Sansón · Uzías · El Trono de Israel",
    icon: Crown,
    accent: "#7A3B4E",
    scene: "jueces_reyes",
    questions: [
      { q: "¿Qué voto especial marcó la vida de Sansón desde su nacimiento?", options: ["El voto de silencio", "El voto nazareo", "El voto de pobreza", "El voto sacerdotal"], correct: 1, ref: "Jueces 13:5" },
      { q: "¿Qué animal mató Sansón con sus propias manos?", options: ["Un lobo", "Un león", "Un oso", "Un toro"], correct: 1, ref: "Jueces 14:6" },
      { q: "¿Quién descubrió el secreto de la fuerza de Sansón?", options: ["Dalila", "Su madre", "Un sacerdote filisteo", "Su hermano"], correct: 0, ref: "Jueces 16:17" },
      { q: "¿Qué le cortaron a Sansón para quitarle su fuerza?", options: ["La barba", "Las siete guedejas de su cabello", "Las uñas", "Ninguna, fue una trampa"], correct: 1, ref: "Jueces 16:19" },
      { q: "¿A qué edad comenzó a reinar el rey Uzías?", options: ["Dieciséis años", "Treinta años", "Doce años", "Veinte años"], correct: 0, ref: "2 Crónicas 26:1" },
      { q: "¿Qué enfermedad afligió a Uzías tras usurpar funciones sacerdotales?", options: ["Ceguera", "Lepra", "Parálisis", "Fiebre"], correct: 1, ref: "2 Crónicas 26:19" },
      { q: "¿Quién fue el primer rey de Israel, ungido por el profeta Samuel?", options: ["David", "Saúl", "Salomón", "Roboam"], correct: 1, ref: "1 Samuel 10:1" },
      { q: "¿Con qué arma venció David al gigante Goliat?", options: ["Una espada", "Una honda y una piedra", "Una lanza", "Un arco"], correct: 1, ref: "1 Samuel 17:49" },
      { q: "¿Qué juez israelita derrotó a los madianitas con solo 300 hombres?", options: ["Gedeón", "Débora", "Barac", "Otoniel"], correct: 0, ref: "Jueces 7:7" },
      { q: "¿Qué jueza y profetisa lideró a Israel junto al general Barac?", options: ["Rut", "Ester", "Débora", "Ana"], correct: 2, ref: "Jueces 4:4" },
      { q: "¿Cómo murió Sansón, derribando el templo de los filisteos?", options: ["Empujando las columnas centrales", "Prendiendo fuego al templo", "En batalla con la mandíbula de un asno", "De un flechazo"], correct: 0, ref: "Jueces 16:29-30" },
      { q: "¿Qué rey de Israel sucedió a Saúl tras ser ungido por Samuel siendo aún joven?", options: ["David", "Salomón", "Jonatán", "Absalón"], correct: 0, ref: "1 Samuel 16:13" },
      { q: "¿Qué hijo de David se rebeló contra su padre y murió colgado de un árbol por su cabello?", options: ["Absalón", "Salomón", "Amnón", "Adonías"], correct: 0, ref: "2 Samuel 18:9-14" },
      { q: "¿Qué reino se dividió en dos tras la muerte del rey Salomón?", options: ["Israel (norte) y Judá (sur)", "Israel y Egipto", "Judá y Edom", "Samaria y Galilea"], correct: 0, ref: "1 Reyes 12" },
      { q: "¿Quién fue el mejor amigo de David, hijo del rey Saúl?", options: ["Jonatán", "Abner", "Joab", "Natán"], correct: 0, ref: "1 Samuel 18:1-3" },
    ],
  },
  {
    id: "vida_jesus",
    name: "Vida de Jesús",
    subtitle: "Nacimiento · Milagros · Pasión y Resurrección",
    icon: Star,
    accent: "#C97B3D",
    scene: "vida_jesus",
    questions: [
      { q: "¿En qué ciudad nació Jesús según los evangelios?", options: ["Nazaret", "Belén", "Jerusalén", "Cafarnaúm"], correct: 1, ref: "Lucas 2:4-7" },
      { q: "¿Cuál fue el primer milagro público de Jesús, en las bodas de Caná?", options: ["Sanar a un ciego", "Convertir agua en vino", "Caminar sobre el agua", "Resucitar a un muerto"], correct: 1, ref: "Juan 2:1-11" },
      { q: "¿Cuántos panes y peces usó Jesús para alimentar a cinco mil personas?", options: ["5 panes y 2 peces", "2 panes y 5 peces", "7 panes y 3 peces", "3 panes y 7 peces"], correct: 0, ref: "Juan 6:9" },
      { q: "¿Cómo se conoce el discurso de Jesús que incluye las Bienaventuranzas?", options: ["El Sermón del Monte", "La Parábola Mayor", "El Discurso del Templo", "La Oración del Huerto"], correct: 0, ref: "Mateo 5-7" },
      { q: "¿Quién traicionó a Jesús por treinta piezas de plata?", options: ["Pedro", "Judas Iscariote", "Tomás", "Andrés"], correct: 1, ref: "Mateo 26:14-15" },
      { q: "¿Qué ocurrió al tercer día después de la crucifixión de Jesús?", options: ["Fue enterrado", "Resucitó", "Ascendió al cielo", "Apareció en Galilea por primera vez"], correct: 1, ref: "Lucas 24:6" },
      { q: "¿Quién bautizó a Jesús en el río Jordán?", options: ["Pedro", "Juan el Bautista", "Andrés", "Felipe"], correct: 1, ref: "Mateo 3:13" },
      { q: "¿Cuántos días ayunó Jesús en el desierto antes de ser tentado?", options: ["7 días", "40 días", "12 días", "100 días"], correct: 1, ref: "Mateo 4:2" },
      { q: "¿Cuántos discípulos escogió Jesús como sus apóstoles más cercanos?", options: ["7", "10", "12", "70"], correct: 2, ref: "Mateo 10:1-4" },
      { q: "¿A quién resucitó Jesús cuatro días después de su muerte, en Betania?", options: ["Jairo", "Lázaro", "El hijo de la viuda de Naín", "El siervo del centurión"], correct: 1, ref: "Juan 11:43-44" },
      { q: "¿Sobre qué caminó Jesús para acercarse a sus discípulos en la barca?", options: ["El agua del mar de Galilea", "Un puente de piedra", "Una barca cercana", "La orilla"], correct: 0, ref: "Mateo 14:25" },
      { q: "¿Qué le pidió Jesús a un ciego de nacimiento que hiciera para sanar?", options: ["Lavarse en el estanque de Siloé", "Tocar su manto", "Ayunar tres días", "Orar en el templo"], correct: 0, ref: "Juan 9:7" },
      { q: "¿En qué animal entró Jesús a Jerusalén el Domingo de Ramos?", options: ["Un asno", "Un caballo blanco", "Un camello", "A pie"], correct: 0, ref: "Mateo 21:7" },
      { q: "¿Qué instituyó Jesús con el pan y el vino durante la Última Cena?", options: ["La Santa Cena", "El bautismo", "El lavado de pies", "La ofrenda del templo"], correct: 0, ref: "Lucas 22:19-20" },
      { q: "¿Cuántos días permaneció Jesús con sus discípulos después de resucitar, antes de ascender al cielo?", options: ["3 días", "40 días", "7 días", "100 días"], correct: 1, ref: "Hechos 1:3" },
    ],
  },
  {
    id: "apostoles",
    name: "Apóstoles e Iglesia",
    subtitle: "Pentecostés · Pedro · Pablo",
    icon: Users,
    accent: "#6E7A4C",
    scene: "apostoles",
    questions: [
      { q: "¿Qué evento marcó el nacimiento de la iglesia con lenguas de fuego?", options: ["La Transfiguración", "Pentecostés", "La Ascensión", "El Bautismo de Jesús"], correct: 1, ref: "Hechos 2:1-4" },
      { q: "¿Quién era Saulo de Tarso antes de convertirse en el apóstol Pablo?", options: ["Un pescador", "Un perseguidor de los cristianos", "Un sacerdote del templo", "Un soldado romano"], correct: 1, ref: "Hechos 9:1-2" },
      { q: "¿Qué vio Saulo camino a Damasco que lo hizo caer al suelo?", options: ["Un ángel con espada", "Una luz del cielo", "Un terremoto", "Una zarza ardiente"], correct: 1, ref: "Hechos 9:3" },
      { q: "¿Quién negó tres veces conocer a Jesús antes de que cantara el gallo?", options: ["Juan", "Pedro", "Santiago", "Felipe"], correct: 1, ref: "Mateo 26:34" },
      { q: "¿En qué isla naufragó el apóstol Pablo camino a Roma?", options: ["Chipre", "Malta", "Creta", "Rodas"], correct: 1, ref: "Hechos 28:1" },
      { q: "¿Qué apóstol escribió el libro de Apocalipsis desde la isla de Patmos?", options: ["Pedro", "Santiago", "Juan", "Mateo"], correct: 2, ref: "Apocalipsis 1:9" },
      { q: "¿Cuántas cartas del Nuevo Testamento se atribuyen al apóstol Pablo?", options: ["7", "13", "20", "4"], correct: 1, ref: "Cartas paulinas" },
      { q: "¿Quién era Esteban, el primer mártir cristiano?", options: ["Un apóstol", "Un diácono de la iglesia", "Un fariseo convertido", "Un sacerdote del templo"], correct: 1, ref: "Hechos 6:5" },
      { q: "¿Qué oficio tenían Pedro y Andrés antes de seguir a Jesús?", options: ["Agricultores", "Pescadores", "Cobradores de impuestos", "Carpinteros"], correct: 1, ref: "Mateo 4:18" },
      { q: "¿Quién acompañó a Pablo en gran parte de sus viajes misioneros y escribió el libro de Hechos?", options: ["Lucas", "Marcos", "Timoteo", "Bernabé"], correct: 0, ref: "Hechos (autoría tradicional)" },
      { q: "¿Quién era el apóstol conocido por dudar de la resurrección hasta tocar las heridas de Jesús?", options: ["Tomás", "Felipe", "Bartolomé", "Judas Tadeo"], correct: 0, ref: "Juan 20:25" },
      { q: "¿Qué ángel liberó a Pedro de la cárcel milagrosamente?", options: ["Un ángel del Señor", "Gabriel", "Miguel", "Ninguno, escapó él solo"], correct: 0, ref: "Hechos 12:7" },
      { q: "¿En qué ciudad se llamó por primera vez 'cristianos' a los discípulos?", options: ["Antioquía", "Jerusalén", "Éfeso", "Corinto"], correct: 0, ref: "Hechos 11:26" },
      { q: "¿Quién fue lapidado mientras veía los cielos abiertos y a Jesús de pie a la diestra de Dios?", options: ["Esteban", "Santiago", "Felipe", "Bernabé"], correct: 0, ref: "Hechos 7:55-59" },
      { q: "¿Qué compañero de viaje abandonó a Pablo y Bernabé, causando después una disputa entre ellos?", options: ["Juan Marcos", "Silas", "Tito", "Timoteo"], correct: 0, ref: "Hechos 15:37-39" },
    ],
  },
  {
    id: "sabiduria",
    name: "Sabiduría y Profetas",
    subtitle: "Salomón · Job · Jonás · Daniel",
    icon: BookOpen,
    accent: "#8F7A46",
    scene: "sabiduria",
    questions: [
      { q: "¿Qué profeta fue tragado por un gran pez tras huir de Dios?", options: ["Elías", "Jonás", "Isaías", "Ezequiel"], correct: 1, ref: "Jonás 1:17" },
      { q: "¿Qué rey pidió sabiduría a Dios en lugar de riquezas?", options: ["David", "Saúl", "Salomón", "Josías"], correct: 2, ref: "1 Reyes 3:9" },
      { q: "¿Cuántos hijos e hijas perdió Job en un solo día?", options: ["7", "10", "12", "3"], correct: 1, ref: "Job 1:19" },
      { q: "¿En qué foso fue arrojado Daniel por orar a Dios?", options: ["Foso de las serpientes", "Foso de los leones", "Foso de fuego", "Pozo seco"], correct: 1, ref: "Daniel 6:16" },
      { q: "¿Qué libro de cantos y alabanzas se atribuye principalmente al rey David?", options: ["Proverbios", "Eclesiastés", "Los Salmos", "Cantares"], correct: 2, ref: "Libro de los Salmos" },
      { q: "¿Qué tres jóvenes hebreos fueron arrojados a un horno de fuego por no adorar una estatua?", options: ["Sadrac, Mesac y Abed-nego", "David, Salomón y Roboam", "Elías, Eliseo y Josué", "Ana, María y Marta"], correct: 0, ref: "Daniel 3" },
      { q: "¿Qué profeta subió al cielo en un torbellino, en un carro de fuego?", options: ["Elías", "Eliseo", "Isaías", "Jeremías"], correct: 0, ref: "2 Reyes 2:11" },
      { q: "¿Qué reina se atrevió a presentarse ante el rey sin ser llamada para salvar a su pueblo?", options: ["Rut", "Ester", "Betsabé", "Jezabel"], correct: 1, ref: "Ester 4:16" },
      { q: "¿Qué escribió el rey Salomón sobre la vanidad de la vida y el sentido de la existencia?", options: ["Eclesiastés", "Job", "Lamentaciones", "Cantares"], correct: 0, ref: "Libro de Eclesiastés" },
      { q: "¿Quién interpretó el escrito misterioso que apareció en la pared durante un banquete real?", options: ["Daniel", "Ezequiel", "Nehemías", "Esdras"], correct: 0, ref: "Daniel 5:25-28" },
      { q: "¿Qué profeta vio en visión un valle lleno de huesos secos que volvían a la vida?", options: ["Ezequiel", "Isaías", "Jeremías", "Oseas"], correct: 0, ref: "Ezequiel 37:1-10" },
      { q: "¿Qué le dijo Dios a Job desde el torbellino al final de sus sufrimientos?", options: ["Le preguntó dónde estaba cuando fundó la tierra", "Le prometió riquezas inmediatas", "Guardó silencio", "Le mostró el rostro de Satanás"], correct: 0, ref: "Job 38:4" },
      { q: "¿Qué profeta lloró por la destrucción de Jerusalén y escribió Lamentaciones?", options: ["Jeremías", "Isaías", "Miqueas", "Amós"], correct: 0, ref: "Lamentaciones (autoría tradicional)" },
      { q: "¿Qué edificó el rey Salomón en Jerusalén como morada para Dios?", options: ["El Templo", "El palacio real solamente", "Una torre", "El tabernáculo móvil"], correct: 0, ref: "1 Reyes 6:1" },
      { q: "¿Qué profeta se negó al principio a comer los manjares del rey de Babilonia para no contaminarse?", options: ["Daniel", "Ezequiel", "Jeremías", "Isaías"], correct: 0, ref: "Daniel 1:8" },
    ],
  },
];

const TIME_PER_QUESTION = 18;
const LIVES_START = 3;
const COINS_PER_CORRECT = 10;
const REVIVE_COST_COINS = 60;
const COINS_LEVEL_CLEAR = 50;
const COINS_PERFECT_BONUS = 25;
const PROGRESS_KEY = "db_progress_v1";
const DAILY_REWARDS = [15, 20, 25, 35, 45, 60, 100];

const THEMES = [
  { id: "oro", name: "Sello Dorado", cost: 0, colors: ["#6f9a5f", "#3f5f38", "#b0503c", "#6e2c1f"] },
  { id: "arcilla", name: "Sello de Arcilla", cost: 80, colors: ["#c17b4a", "#7a4423", "#b0503c", "#6e2c1f"] },
  { id: "lapislazuli", name: "Sello de Lapislázuli", cost: 120, colors: ["#3f5ea8", "#1f2f5c", "#b0503c", "#6e2c1f"] },
  { id: "cobre", name: "Sello Cobre", cost: 150, colors: ["#c9873f", "#7a4f1f", "#b0503c", "#6e2c1f"] },
];

const COIN_PACKAGES = [
  { id: "pack_s", label: "Bolsa de monedas", coins: 150, bonus: 0, price: "$0.99" },
  { id: "pack_m", label: "Cofre mediano", coins: 500, bonus: 50, price: "$2.99" },
  { id: "pack_l", label: "Cofre grande", coins: 1200, bonus: 200, price: "$5.99" },
  { id: "pack_xl", label: "Arca del tesoro", coins: 3000, bonus: 700, price: "$11.99" },
];

/* ------------------------------------------------------------------ */
/* HELPERS                                                             */
/* ------------------------------------------------------------------ */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function suggestCoinPackage(missingCoins) {
  const best = COIN_PACKAGES.find((p) => p.coins + p.bonus >= missingCoins);
  return (best || COIN_PACKAGES[COIN_PACKAGES.length - 1]).id;
}

function dateStr(d) {
  return d.toISOString().slice(0, 10);
}
function todayStr() {
  return dateStr(new Date());
}
function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateStr(d);
}

const DEFAULT_PROGRESS = { unlockedIndex: 0, coins: 0, completed: {}, themeId: "oro", dailyStreak: 0, lastClaimDate: null, isPremium: false };

async function loadProgress() {
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (raw) return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch (e) {
    /* first run — no saved progress yet, or storage blocked (e.g. private mode) */
  }
  return { ...DEFAULT_PROGRESS };
}

async function saveProgress(data) {
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("No se pudo guardar el progreso", e);
  }
}

function LampLife({ lit }) {
  return (
    <div style={{ width: 22, height: 22, opacity: lit ? 1 : 0.25, filter: lit ? "drop-shadow(0 0 6px #F0C869)" : "none", transition: "opacity .4s ease" }}>
      <Flame size={22} color={lit ? "#F0C869" : "#5b5346"} fill={lit ? "#E29A3C" : "none"} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SCENE ART — fondos ilustrados originales por categoría             */
/* ------------------------------------------------------------------ */

function SceneArt({ id, accent, opacity = 0.35 }) {
  const common = { opacity, transition: "opacity .4s ease" };
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", ...common }}>
      <defs>
        <radialGradient id={`glow-${id}`} cx="50%" cy="20%" r="70%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#glow-${id})`} />

      {id === "origenes" && (
        <g fill="none" stroke={accent} strokeWidth="1.4">
          <circle cx="200" cy="60" r="34" fill={accent} opacity="0.5" />
          {[40, 52, 64, 76, 88].map((r) => (
            <circle key={r} cx="200" cy="60" r={r} opacity="0.25" />
          ))}
          <path d="M120 240 C140 160 160 140 160 100" opacity="0.6" />
          <path d="M280 240 C260 160 240 140 240 100" opacity="0.6" />
          <path d="M160 130 C150 120 140 122 132 116" opacity="0.5" />
          <path d="M240 130 C250 120 260 122 268 116" opacity="0.5" />
        </g>
      )}

      {id === "diluvio" && (
        <g>
          <g stroke={accent} strokeWidth="1.2" opacity="0.5">
            {[0, 1, 2, 3].map((i) => (
              <path key={i} d={`M0 ${170 + i * 16} Q50 ${158 + i * 16} 100 ${170 + i * 16} T200 ${170 + i * 16} T300 ${170 + i * 16} T400 ${170 + i * 16}`} fill="none" />
            ))}
          </g>
          <path d="M150 168 L250 168 L232 200 L168 200 Z" fill={accent} opacity="0.55" />
          <path d="M170 168 L170 148 L230 148 L230 168" fill="none" stroke={accent} strokeWidth="2" opacity="0.5" />
          <g stroke={accent} strokeWidth="1" opacity="0.35">
            <line x1="60" y1="20" x2="50" y2="50" />
            <line x1="90" y1="10" x2="80" y2="45" />
            <line x1="320" y1="15" x2="310" y2="48" />
            <line x1="350" y1="25" x2="340" y2="55" />
          </g>
        </g>
      )}

      {id === "patriarcas" && (
        <g>
          <path d="M90 200 L140 130 L190 200 Z" fill={accent} opacity="0.45" />
          <path d="M210 200 L260 120 L310 200 Z" fill={accent} opacity="0.5" />
          <path d="M120 200 L140 165 L160 200 Z" fill={accent} opacity="0.35" />
          <g fill={accent} opacity="0.7">
            {[[30, 30], [60, 55], [340, 40], [370, 70], [200, 25], [250, 45], [110, 20]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1.6" />
            ))}
          </g>
        </g>
      )}

      {id === "exodo" && (
        <g>
          <path d="M60 240 L60 60 Q100 20 130 60 L130 240 Z" fill={accent} opacity="0.4" />
          <path d="M340 240 L340 60 Q300 20 270 60 L270 240 Z" fill={accent} opacity="0.4" />
          <path d="M195 240 Q200 160 185 120 Q200 130 200 90 Q215 130 200 150 Q212 170 195 240 Z" fill={accent} opacity="0.65" />
        </g>
      )}

      {id === "jueces_reyes" && (
        <g>
          <rect x="90" y="70" width="22" height="170" fill={accent} opacity="0.45" />
          <rect x="288" y="70" width="22" height="170" fill={accent} opacity="0.45" />
          <rect x="80" y="55" width="42" height="16" fill={accent} opacity="0.5" />
          <rect x="278" y="55" width="42" height="16" fill={accent} opacity="0.5" />
          <path d="M170 50 L200 20 L230 50 L215 50 L215 65 L185 65 L185 50 Z" fill={accent} opacity="0.6" />
        </g>
      )}

      {id === "vida_jesus" && (
        <g>
          <g fill={accent} opacity="0.8">
            <polygon points="200,15 208,35 230,35 212,48 219,70 200,57 181,70 188,48 170,35 192,35" />
          </g>
          <path d="M40 240 L200 100 L360 240 Z" fill={accent} opacity="0.25" />
          <g stroke={accent} strokeWidth="3" opacity="0.55">
            <line x1="120" y1="240" x2="120" y2="175" />
            <line x1="100" y1="195" x2="140" y2="195" />
            <line x1="200" y1="240" x2="200" y2="160" />
            <line x1="176" y1="185" x2="224" y2="185" />
            <line x1="280" y1="240" x2="280" y2="175" />
            <line x1="260" y1="195" x2="300" y2="195" />
          </g>
        </g>
      )}

      {id === "apostoles" && (
        <g>
          <g fill={accent} opacity="0.6">
            {[80, 140, 200, 260, 320].map((x, i) => (
              <path key={i} d={`M${x} ${190 - (i % 2) * 10} q8 -30 0 -46 q-8 16 0 46 z`} />
            ))}
          </g>
          <path d="M200 90 q-24 -6 -30 10 q14 -2 20 4 q-10 4 -12 14 q16 -4 22 -16 q10 12 26 12 q-4 -12 -14 -16 q10 -4 16 -14 q-16 -2 -28 6 z" fill={accent} opacity="0.6" />
        </g>
      )}

      {id === "sabiduria" && (
        <g>
          <path d="M0 200 Q60 180 120 200 T240 200 T400 200 L400 240 L0 240 Z" fill={accent} opacity="0.3" />
          <rect x="160" y="150" width="80" height="14" rx="7" fill={accent} opacity="0.55" />
          <rect x="168" y="130" width="64" height="20" rx="4" fill={accent} opacity="0.4" />
          <path d="M290 190 q-4 -22 10 -30 q-2 14 6 20 q-10 2 -16 10 z" fill={accent} opacity="0.6" />
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* WAX SEAL — elemento distintivo de retroalimentación                 */
/* ------------------------------------------------------------------ */

function WaxSeal({ status, theme }) {
  if (!status) return null;
  const isCorrect = status === "correct";
  const [c1, c2, w1, w2] = theme.colors;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 30 }}>
      <div
        className="seal-stamp"
        style={{
          width: 132, height: 132, borderRadius: "50%",
          background: isCorrect ? `radial-gradient(circle at 35% 30%, ${c1}, ${c2} 70%)` : `radial-gradient(circle at 35% 30%, ${w1}, ${w2} 70%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,.55), inset 0 2px 6px rgba(255,255,255,.25), inset 0 -6px 10px rgba(0,0,0,.4)",
          border: "3px solid rgba(240,200,105,.55)",
        }}
      >
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, letterSpacing: "0.08em", color: "#F2E6C9", textTransform: "uppercase", textShadow: "0 1px 2px rgba(0,0,0,.6)", textAlign: "center", lineHeight: 1.3 }}>
          {isCorrect ? "Verdad" : "Errado"}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* COIN PILL + AD MODAL (monetización)                                 */
/* ------------------------------------------------------------------ */

function CoinPill({ coins, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "rgba(240,200,105,.12)", border: "1px solid rgba(240,200,105,.4)",
        borderRadius: 999, padding: "6px 12px", cursor: "pointer",
        fontFamily: "'Playfair Display', serif", fontSize: 13, color: "#F0C869",
      }}
    >
      <Coins size={14} /> {coins}
    </button>
  );
}

function AdModal({ onClose, onReward, rewardLabel }) {
  const [seconds, setSeconds] = useState(2);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (seconds <= 0) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 700);
    return () => clearTimeout(t);
  }, [seconds]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,10,6,.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 340, background: "linear-gradient(160deg, #3c2a1a, #1e150d)", border: "1px solid rgba(240,200,105,.3)", borderRadius: 16, padding: 26, textAlign: "center", position: "relative" }}>
        {!done && (
          <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: "#9C927B", cursor: "pointer" }}>
            <X size={18} />
          </button>
        )}
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, letterSpacing: "0.1em", color: "#9C927B", marginBottom: 6 }}>
          ANUNCIO RECOMPENSADO · DEMO
        </div>
        {!done ? (
          <>
            <div style={{ width: 64, height: 64, borderRadius: "50%", border: "3px solid rgba(240,200,105,.35)", borderTopColor: "#F0C869", margin: "18px auto", animation: "spin .7s linear infinite" }} />
            <p style={{ color: "#EDE3CD", fontSize: 15 }}>Reproduciendo anuncio simulado… {seconds}s</p>
          </>
        ) : (
          <>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #E8C26D, #A9791F 75%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "18px auto" }}>
              <Check size={30} color="#241D0C" />
            </div>
            <p style={{ color: "#EDE3CD", fontSize: 15, marginBottom: 18 }}>{rewardLabel}</p>
            <button
              onClick={onReward}
              style={{ background: "linear-gradient(180deg, #E8C26D, #B4881F)", color: "#241D0C", fontFamily: "'Playfair Display', serif", fontSize: 13, letterSpacing: "0.05em", fontWeight: 600, padding: "11px 22px", borderRadius: 999, border: "none", cursor: "pointer" }}
            >
              RECLAMAR
            </button>
          </>
        )}
        <p style={{ fontSize: 11, color: "#6b6350", marginTop: 18, lineHeight: 1.5 }}>
          Espacio reservado para un SDK real de anuncios (AdMob / Meta Audience Network) al publicar la app.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DAILY REWARD — racha diaria de monedas                             */
/* ------------------------------------------------------------------ */

function DailyRewardModal({ streakDay, reward, onClaim, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,10,6,.82)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 380, background: "linear-gradient(160deg, #3c2a1a, #1e150d)", border: "1px solid rgba(240,200,105,.3)", borderRadius: 16, padding: 26, textAlign: "center", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: "#9C927B", cursor: "pointer" }}>
          <X size={18} />
        </button>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #E8C26D, #A9791F 75%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "4px auto 14px", boxShadow: "0 8px 22px rgba(201,162,39,.4)" }}>
          <Gift size={26} color="#241D0C" />
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#F2E6C9", marginBottom: 6 }}>Bendición diaria</div>
        <p style={{ color: "#9C927B", fontSize: 13.5, marginBottom: 20, lineHeight: 1.5 }}>Regresa cada día para hacer crecer tu racha y ganar más monedas.</p>

        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 22 }}>
          {DAILY_REWARDS.map((r, i) => {
            const day = i + 1;
            const isToday = day === streakDay;
            const isPast = day < streakDay;
            return (
              <div
                key={day}
                style={{
                  width: 42, borderRadius: 10, padding: "8px 0",
                  background: isToday ? "rgba(240,200,105,.18)" : "rgba(237,227,205,.05)",
                  border: `1.5px solid ${isToday ? "#F0C869" : isPast ? "rgba(240,200,105,.35)" : "rgba(237,227,205,.15)"}`,
                  opacity: isPast ? 0.55 : 1,
                }}
              >
                <div style={{ fontSize: 9.5, color: isToday ? "#F0C869" : "#8a8272", fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>D{day}</div>
                <Coins size={13} color={isToday ? "#F0C869" : "#8a8272"} style={{ margin: "0 auto 3px", display: "block" }} />
                <div style={{ fontSize: 10.5, color: isToday ? "#F2E6C9" : "#8a8272" }}>{r}</div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClaim}
          style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "linear-gradient(180deg, #E8C26D, #B4881F)", color: "#241D0C", fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 600, padding: "13px 18px", borderRadius: 999, border: "none", cursor: "pointer" }}
        >
          <Coins size={16} /> RECLAMAR {reward} MONEDAS
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAYMENT MODAL — simulación de pago real (Play Billing/App Store)    */
/* ------------------------------------------------------------------ */

function PaymentModal({ onClose, onSuccess, successText = "Compra añadida a tu cofre." }) {
  const [status, setStatus] = useState("processing"); // processing | success

  useEffect(() => {
    const t = setTimeout(() => setStatus("success"), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,10,6,.82)", zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 340, background: "linear-gradient(160deg, #3c2a1a, #1e150d)", border: "1px solid rgba(240,200,105,.3)", borderRadius: 16, padding: 26, textAlign: "center", position: "relative" }}>
        {status === "success" && (
          <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: "#9C927B", cursor: "pointer" }}>
            <X size={18} />
          </button>
        )}
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, letterSpacing: "0.1em", color: "#9C927B", marginBottom: 6 }}>
          PASARELA DE PAGO · DEMO
        </div>
        {status === "processing" ? (
          <>
            <div style={{ width: 64, height: 64, borderRadius: "50%", border: "3px solid rgba(240,200,105,.35)", borderTopColor: "#F0C869", margin: "18px auto", animation: "spin .7s linear infinite" }} />
            <p style={{ color: "#EDE3CD", fontSize: 15 }}>Procesando pago simulado…</p>
          </>
        ) : (
          <>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #E8C26D, #A9791F 75%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "18px auto" }}>
              <Check size={30} color="#241D0C" />
            </div>
            <p style={{ color: "#F2E6C9", fontSize: 16, fontFamily: "'Playfair Display', serif", marginBottom: 6 }}>¡Compra exitosa!</p>
            <p style={{ color: "#9C927B", fontSize: 13.5, marginBottom: 18, lineHeight: 1.5 }}>{successText}</p>
            <button
              onClick={onSuccess}
              style={{ background: "linear-gradient(180deg, #E8C26D, #B4881F)", color: "#241D0C", fontFamily: "'Playfair Display', serif", fontSize: 13, letterSpacing: "0.05em", fontWeight: 600, padding: "11px 22px", borderRadius: 999, border: "none", cursor: "pointer" }}
            >
              CONTINUAR
            </button>
          </>
        )}
        <p style={{ fontSize: 11, color: "#6b6350", marginTop: 18, lineHeight: 1.5 }}>
          Espacio reservado para Google Play Billing / App Store / Stripe al publicar la app. No se procesa ningún cargo real.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SHOP — economía gratuita + maqueta de monetización real            */
/* ------------------------------------------------------------------ */

const SHOP_TABS = [
  { id: "sellos", label: "Sellos", icon: Sparkles },
  { id: "monedas", label: "Monedas", icon: Coins },
  { id: "premium", label: "Premium", icon: Crown },
  { id: "anuncios", label: "Anuncios", icon: Gift },
];

function Shop({ coins, themeId, onBuyTheme, onClose, onOpenAd, isPremium, onOpenPurchase, onBuyCoinPackage, initialTab, initialSuggestedPkgId, initialOrigin, lastPurchaseAt }) {
  const [tab, setTab] = useState(initialTab || "sellos");
  const [shortfall, setShortfall] = useState(null); // theme the user couldn't afford
  const [suggestedPkgId, setSuggestedPkgId] = useState(initialSuggestedPkgId || null);
  const [origin, setOrigin] = useState(initialOrigin || null); // why the shop (or its coin tab) was opened
  const [highlightThemeId, setHighlightThemeId] = useState(null);
  const firstPurchaseTick = useRef(lastPurchaseAt);

  // React to a purchase completing elsewhere (PaymentModal), based on why the shop was opened.
  useEffect(() => {
    if (lastPurchaseAt === firstPurchaseTick.current) return;
    firstPurchaseTick.current = lastPurchaseAt;
    if (origin?.kind === "revive") {
      onClose(); // hand control back to the game — the revive offer resumes underneath with the new balance
      return;
    }
    if (origin?.kind === "theme") {
      setTab("sellos");
      setHighlightThemeId(origin.themeId);
      setTimeout(() => setHighlightThemeId(null), 1150);
    }
    setOrigin(null);
  }, [lastPurchaseAt, origin, onClose]);

  function goBuyCoins(neededCoins, forTheme) {
    setSuggestedPkgId(suggestCoinPackage(neededCoins - coins));
    if (forTheme) setOrigin({ kind: "theme", themeId: forTheme.id });
    setTab("monedas");
    setShortfall(null);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,10,6,.82)", zIndex: 90, overflowY: "auto", padding: "40px 18px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#F2E6C9", display: "flex", alignItems: "center", gap: 10 }}>
            <ShoppingBag size={20} /> Tienda
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#9C927B", cursor: "pointer" }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(240,200,105,.08)", border: "1px solid rgba(240,200,105,.25)", borderRadius: 12, padding: "14px 16px", marginBottom: 18, gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#F0C869", fontFamily: "'Playfair Display', serif" }}>
            <Coins size={18} /> {coins} monedas
          </div>
          {isPremium && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#F0C869", fontFamily: "'Playfair Display', serif", fontSize: 12 }}>
              <Check size={14} /> Premium activo · sin anuncios
            </div>
          )}
        </div>

        {!isPremium && tab !== "premium" && (
          <button
            onClick={() => setTab("premium")}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
              background: "rgba(240,200,105,.06)", border: "1px dashed rgba(240,200,105,.3)", borderRadius: 12,
              padding: "10px 14px", marginBottom: 18, cursor: "pointer", textAlign: "left",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#C7BBA0" }}>
              <Crown size={14} color="#F0C869" /> Sin anuncios y revive al instante con Premium
            </span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, color: "#F0C869", whiteSpace: "nowrap" }}>Ver &rsaquo;</span>
          </button>
        )}

        <div style={{ display: "flex", gap: 6, marginBottom: 24, background: "rgba(237,227,205,.05)", border: "1px solid rgba(237,227,205,.12)", borderRadius: 12, padding: 4 }}>
          {SHOP_TABS.map((t) => {
            const TabIcon = t.icon;
            const activeTab = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setShortfall(null); setOrigin(null); if (t.id !== "monedas") setSuggestedPkgId(null); }}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "10px 8px", borderRadius: 9, border: "none", cursor: "pointer",
                  background: activeTab ? "rgba(240,200,105,.16)" : "transparent",
                  color: activeTab ? "#F0C869" : "#9C927B",
                  fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
                }}
              >
                <TabIcon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === "sellos" && (
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, letterSpacing: "0.08em", color: "#9C927B", marginBottom: 12 }}>
              SELLOS DE CERA (con monedas ganadas jugando)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {THEMES.map((t) => {
                const active = themeId === t.id;
                const affordable = t.cost === 0 || active || coins >= t.cost;
                const justAffordable = highlightThemeId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (!affordable) { setShortfall(t); return; }
                      setShortfall(null);
                      onBuyTheme(t);
                    }}
                    className={justAffordable ? "shop-highlight" : undefined}
                    style={{
                      textAlign: "left", padding: 14, borderRadius: 12,
                      background: active ? "rgba(240,200,105,.14)" : "rgba(237,227,205,.05)",
                      border: `1.5px solid ${active ? "#F0C869" : justAffordable ? "#F0C869" : shortfall?.id === t.id ? "#B0503C" : "rgba(237,227,205,.18)"}`,
                      cursor: "pointer",
                      opacity: affordable ? 1 : 0.7,
                    }}
                  >
                    <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${t.colors[0]}, ${t.colors[1]} 75%)` }} />
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${t.colors[2]}, ${t.colors[3]} 75%)` }} />
                    </div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13.5, color: "#F2E6C9", marginBottom: 4 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: active ? "#F0C869" : affordable ? "#9C927B" : "#C97A5E" }}>
                      {active ? "En uso" : t.cost === 0 ? "Incluido" : affordable ? `${t.cost} monedas` : `Faltan ${t.cost - coins} monedas`}
                    </div>
                  </button>
                );
              })}
            </div>

            {shortfall && (
              <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "rgba(176,80,60,.1)", border: "1px solid rgba(176,80,60,.35)", borderRadius: 12, padding: "12px 14px", flexWrap: "wrap" }}>
                <div style={{ fontSize: 12.5, color: "#EDE3CD", lineHeight: 1.4 }}>
                  Te faltan <strong style={{ color: "#F0C869" }}>{shortfall.cost - coins} monedas</strong> para "{shortfall.name}".
                </div>
                <button
                  onClick={() => goBuyCoins(shortfall.cost, shortfall)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(180deg, #E8C26D, #B4881F)", color: "#241D0C", fontFamily: "'Playfair Display', serif", fontSize: 11.5, fontWeight: 600, padding: "8px 12px", borderRadius: 999, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  <Coins size={13} /> Comprar monedas
                </button>
              </div>
            )}
          </div>
        )}

        {tab === "monedas" && (
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, letterSpacing: "0.08em", color: "#9C927B", marginBottom: 12 }}>
              PAQUETES DE MONEDAS (dinero real)
            </div>
            {suggestedPkgId && (
              <div style={{ fontSize: 12, color: "#9C927B", marginBottom: 12, lineHeight: 1.4 }}>
                Resaltamos el paquete que te alcanza para lo que querías comprar.
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {COIN_PACKAGES.map((p) => {
                const total = p.coins + p.bonus;
                const suggested = suggestedPkgId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onBuyCoinPackage(p)}
                    style={{
                      textAlign: "left", padding: 14, borderRadius: 12, position: "relative",
                      background: suggested ? "rgba(240,200,105,.14)" : "rgba(237,227,205,.05)",
                      border: `1.5px solid ${suggested ? "#F0C869" : "rgba(237,227,205,.18)"}`,
                      cursor: "pointer",
                    }}
                  >
                    {suggested ? (
                      <div style={{ position: "absolute", top: 10, right: 10, fontSize: 10, fontFamily: "'Playfair Display', serif", color: "#241D0C", background: "#F0C869", borderRadius: 999, padding: "2px 7px" }}>
                        Te alcanza
                      </div>
                    ) : p.bonus > 0 && (
                      <div style={{ position: "absolute", top: 10, right: 10, fontSize: 10, fontFamily: "'Playfair Display', serif", color: "#F0C869", background: "rgba(240,200,105,.14)", border: "1px solid rgba(240,200,105,.35)", borderRadius: 999, padding: "2px 7px" }}>
                        +{p.bonus} extra
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <Coins size={20} color="#F0C869" />
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#F2E6C9" }}>{total}</span>
                    </div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "#F2E6C9", marginBottom: 4 }}>{p.label}</div>
                    <div style={{ fontSize: 12.5, color: "#9C927B" }}>{p.price}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tab === "premium" && (
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, letterSpacing: "0.08em", color: "#9C927B", marginBottom: 12 }}>
              PAQUETE PREMIUM (dinero real)
            </div>
            <div style={{ padding: 16, borderRadius: 12, border: `1.5px ${isPremium ? "solid" : "dashed"} ${isPremium ? "#F0C869" : "rgba(237,227,205,.25)"}`, background: isPremium ? "rgba(240,200,105,.08)" : "transparent" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14.5, color: "#F2E6C9", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                Sin anuncios + 500 monedas
                {isPremium && <Check size={15} color="#F0C869" />}
              </div>
              <div style={{ fontSize: 12.5, color: "#9C927B", lineHeight: 1.5, marginBottom: 12 }}>
                {isPremium
                  ? "Ya tienes el paquete premium: revives instantáneos sin ver anuncios y tu bono de monedas ya fue añadido."
                  : "Quita todos los anuncios y añade 500 monedas de una vez. Al publicar la app, aquí se conecta Google Play Billing / App Store / Stripe para el pago real."}
              </div>
              {!isPremium && (
                <button
                  onClick={onOpenPurchase}
                  style={{ background: "linear-gradient(180deg, #E8C26D, #B4881F)", color: "#241D0C", fontFamily: "'Playfair Display', serif", fontSize: 12.5, fontWeight: 600, padding: "10px 18px", borderRadius: 999, border: "none", cursor: "pointer" }}
                >
                  $2.99 — Comprar (simulado)
                </button>
              )}
            </div>
          </div>
        )}

        {tab === "anuncios" && (
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, letterSpacing: "0.08em", color: "#9C927B", marginBottom: 12 }}>
              ANUNCIOS RECOMPENSADOS
            </div>
            <div style={{ padding: 16, borderRadius: 12, border: "1.5px solid rgba(237,227,205,.18)", background: "rgba(237,227,205,.05)" }}>
              {isPremium ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#F0C869", fontFamily: "'Playfair Display', serif", fontSize: 13.5 }}>
                  <Check size={16} /> Con Premium activo no verás anuncios.
                </div>
              ) : (
                <>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14.5, color: "#F2E6C9", marginBottom: 6 }}>
                    Ve un anuncio y gana monedas
                  </div>
                  <div style={{ fontSize: 12.5, color: "#9C927B", lineHeight: 1.5, marginBottom: 12 }}>
                    Recompensa rápida para conseguir más sellos de cera sin gastar dinero real.
                  </div>
                  <button
                    onClick={onOpenAd}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(180deg, #E8C26D, #B4881F)", color: "#241D0C", fontFamily: "'Playfair Display', serif", fontSize: 12.5, fontWeight: 600, padding: "10px 18px", borderRadius: 999, border: "none", cursor: "pointer" }}
                  >
                    <Gift size={14} /> Ver anuncio: +30 monedas
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TOP BAR — cabecera consistente de marca                             */
/* ------------------------------------------------------------------ */

function TopBar({ coins, onOpenShop, canClaimDaily, onOpenDaily, isPremium, onOpenPremium, soundMuted, onToggleMute, musicOn, onToggleMusic }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 640, margin: "0 auto", padding: "0 4px 8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #E8C26D, #A9791F 75%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Scroll size={14} color="#2c2211" />
        </div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, letterSpacing: "0.08em", color: "#C7BBA0" }}>DESAFÍO BÍBLICO</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {onToggleMusic && (
          <button
            onClick={onToggleMusic}
            aria-label={musicOn ? "Silenciar música" : "Activar música"}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 30, height: 30, borderRadius: "50%",
              background: musicOn ? "rgba(240,200,105,.1)" : "rgba(237,227,205,.06)",
              border: `1px solid ${musicOn ? "rgba(240,200,105,.35)" : "rgba(237,227,205,.15)"}`,
              cursor: "pointer", color: musicOn ? "#F0C869" : "#8a8272",
            }}
          >
            <Music size={14} />
          </button>
        )}
        {onToggleMute && (
          <button
            onClick={onToggleMute}
            aria-label={soundMuted ? "Activar sonido" : "Silenciar sonido"}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 30, height: 30, borderRadius: "50%",
              background: "rgba(237,227,205,.06)", border: "1px solid rgba(237,227,205,.15)",
              cursor: "pointer", color: "#9C927B",
            }}
          >
            {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        )}
        {!isPremium && onOpenPremium && (
          <button
            onClick={onOpenPremium}
            aria-label="Hazte Premium"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 30, height: 30, borderRadius: "50%",
              background: "rgba(240,200,105,.1)", border: "1px solid rgba(240,200,105,.35)",
              cursor: "pointer", color: "#F0C869",
            }}
          >
            <Crown size={14} />
          </button>
        )}
        {onOpenDaily && (
          <button
            onClick={onOpenDaily}
            aria-label="Bendición diaria"
            style={{
              position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 30, height: 30, borderRadius: "50%",
              background: canClaimDaily ? "rgba(240,200,105,.18)" : "rgba(237,227,205,.06)",
              border: `1px solid ${canClaimDaily ? "rgba(240,200,105,.5)" : "rgba(237,227,205,.15)"}`,
              cursor: "pointer", color: canClaimDaily ? "#F0C869" : "#8a8272",
            }}
          >
            <Gift size={14} />
            {canClaimDaily && (
              <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: "#B0503C", boxShadow: "0 0 0 2px #1e150d" }} />
            )}
          </button>
        )}
        <CoinPill coins={coins} onClick={onOpenShop} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SCREENS                                                             */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* HORIZONTE BÍBLICO — paisaje de fondo para toda la app               */
/* Arte original en SVG: dunas, montañas y sol de atardecer            */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* HORIZONTE BÍBLICO — paisaje de fondo, uno distinto por cada nivel   */
/* Arte original en SVG, sin depender de imágenes externas             */
/* ------------------------------------------------------------------ */

const LANDSCAPE_THEMES = {
  general: { sky: ["#1c140c", "#40301d", "#815a30", "#d6a04e"], sun: "#F8DE9E", stars: 0.5 },
  origenes: { sky: ["#241a0c", "#5a3f1c", "#c98f2e", "#f3d488"], sun: "#FCEFC0", stars: 0.15 },
  diluvio: { sky: ["#0e1a1c", "#1f3a3a", "#3f6660", "#8fae9c"], sun: "#DCE7D8", stars: 0.1 },
  patriarcas: { sky: ["#140f10", "#3a2a22", "#6b4a2c", "#a9773c"], sun: "#F3D48F", stars: 0.75 },
  exodo: { sky: ["#1c0d08", "#4a1a12", "#8a2f1e", "#d9622f"], sun: "#FCEFC0", stars: 0.1 },
  jueces_reyes: { sky: ["#170a12", "#3a1526", "#5c2338", "#8a3450"], sun: "#E8B9C6", stars: 0.55 },
  vida_jesus: { sky: ["#1c140c", "#40301d", "#815a30", "#d6a04e"], sun: "#F8DE9E", stars: 0.55 },
  apostoles: { sky: ["#0c1a16", "#1f3a2e", "#3f6650", "#8fae6c"], sun: "#F3EBC0", stars: 0.15 },
  sabiduria: { sky: ["#1a130a", "#453321", "#8a6a34", "#d9b45e"], sun: "#F6DE9E", stars: 0.3 },
};

function LandscapeForeground({ id }) {
  switch (id) {
    case "origenes":
      return (
        <g opacity="0.85">
          <g stroke="#FCEFC0" strokeWidth="2" opacity="0.35">
            {[20, 50, 80, 110, 140, 160].map((a) => {
              const rad = (a * Math.PI) / 180;
              const x1 = 500 + Math.cos(rad) * 220, y1 = 440 - Math.sin(rad) * 220;
              const x2 = 500 + Math.cos(rad) * 270, y2 = 440 - Math.sin(rad) * 270;
              return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>
          <path d="M210,618 C220,560 236,540 236,500" fill="none" stroke="#160f07" strokeWidth="6" opacity="0.9" />
          <path d="M790,618 C780,560 764,540 764,500" fill="none" stroke="#160f07" strokeWidth="6" opacity="0.9" />
          <path d="M236,510 C222,498 208,502 196,494" fill="none" stroke="#160f07" strokeWidth="4" opacity="0.75" />
          <path d="M764,510 C778,498 792,502 804,494" fill="none" stroke="#160f07" strokeWidth="4" opacity="0.75" />
        </g>
      );
    case "diluvio":
      return (
        <g>
          <g stroke="#c8d8d2" strokeWidth="1.4" opacity="0.28">
            <line x1="120" y1="40" x2="100" y2="100" />
            <line x1="220" y1="20" x2="196" y2="86" />
            <line x1="760" y1="30" x2="738" y2="94" />
            <line x1="860" y1="50" x2="838" y2="112" />
          </g>
          <g stroke="#182c2a" strokeWidth="1.3" opacity="0.6" fill="none">
            {[0, 1, 2, 3].map((i) => (
              <path key={i} d={`M0,${590 + i * 20} Q140,${572 + i * 20} 280,${590 + i * 20} T560,${590 + i * 20} T840,${590 + i * 20} T1000,${590 + i * 20}`} />
            ))}
          </g>
          <path d="M410,595 L590,595 L556,636 L444,636 Z" fill="#0c0f0e" opacity="0.92" />
          <path d="M432,595 L432,556 L568,556 L568,595" fill="none" stroke="#0c0f0e" strokeWidth="5" opacity="0.9" />
        </g>
      );
    case "patriarcas":
      return (
        <g opacity="0.92">
          <path d="M290,618 L358,528 L426,618 Z" fill="#130d07" />
          <path d="M320,618 L358,556 L396,618" fill="none" stroke="#0a0603" strokeWidth="2" opacity="0.7" />
          <g fill="none" stroke="#130d07" strokeWidth="5" strokeLinecap="round">
            <path d="M700,618 L700,560 Q690,540 706,524" />
            <path d="M706,524 Q716,512 730,516" />
            <path d="M700,560 L748,560 L748,618" />
            <path d="M668,618 L668,588 M780,618 L780,588" strokeWidth="6" />
          </g>
        </g>
      );
    case "exodo":
      return (
        <g opacity="0.85">
          <path d="M330,700 L330,260 Q360,230 330,205 Q302,182 330,150 L330,90 L285,90 L285,700 Z" fill="#0b1420" opacity="0.7" />
          <path d="M670,700 L670,260 Q640,230 670,205 Q698,182 670,150 L670,90 L715,90 L715,700 Z" fill="#0b1420" opacity="0.7" />
          <ellipse cx="500" cy="130" rx="46" ry="70" fill="#F3D08A" opacity="0.4" />
        </g>
      );
    case "jueces_reyes":
      return (
        <g fill="#170a12" opacity="0.9">
          <rect x="430" y="470" width="30" height="150" />
          <rect x="540" y="470" width="30" height="150" />
          <rect x="410" y="450" width="70" height="24" />
          <rect x="520" y="450" width="70" height="24" />
          <path d="M455,430 L500,388 L545,430 L520,430 L520,450 L480,450 L480,430 Z" />
        </g>
      );
    case "vida_jesus":
      return (
        <g>
          <g fill="#F8DE9E" opacity="0.85">
            <polygon points="500,300 508,322 532,322 512,336 520,360 500,346 480,360 488,336 468,322 492,322" />
          </g>
          <g stroke="#170f08" strokeWidth="4" opacity="0.7">
            <line x1="360" y1="618" x2="360" y2="548" />
            <line x1="336" y1="572" x2="384" y2="572" />
            <line x1="500" y1="618" x2="500" y2="524" />
            <line x1="470" y1="556" x2="530" y2="556" />
            <line x1="640" y1="618" x2="640" y2="548" />
            <line x1="616" y1="572" x2="664" y2="572" />
          </g>
        </g>
      );
    case "apostoles":
      return (
        <g opacity="0.9">
          <path d="M420,610 L580,610 L556,636 L444,636 Z" fill="#0c1611" />
          <path d="M450,610 L450,562 L560,600 Z" fill="none" stroke="#0c1611" strokeWidth="4" opacity="0.85" />
          <g stroke="#132018" strokeWidth="1.2" opacity="0.5" fill="none">
            <path d="M0,600 Q150,586 300,600 T600,600 T900,600 T1000,596" />
          </g>
        </g>
      );
    case "sabiduria":
      return (
        <g opacity="0.9">
          <rect x="420" y="560" width="160" height="22" rx="11" fill="#160f06" />
          <rect x="434" y="536" width="132" height="30" rx="6" fill="#160f06" opacity="0.85" />
          <path d="M660,560 Q650,528 674,510 Q664,532 682,544 Q662,546 656,562 Z" fill="#160f06" opacity="0.85" />
        </g>
      );
    default:
      return null;
  }
}

function Landscape({ id = "general" }) {
  const theme = LANDSCAPE_THEMES[id] || LANDSCAPE_THEMES.general;
  const [c1, c2, c3, c4] = theme.sky;
  const gradId = `db-sky-${id}`;
  const sunId = `db-sun-${id}`;
  return (
    <svg
      viewBox="0 0 1000 700"
      preserveAspectRatio="xMidYMax slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transition: "opacity .5s ease" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="42%" stopColor={c2} />
          <stop offset="72%" stopColor={c3} />
          <stop offset="100%" stopColor={c4} />
        </linearGradient>
        <radialGradient id={sunId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={theme.sun} stopOpacity="0.95" />
          <stop offset="55%" stopColor={theme.sun} stopOpacity="0.28" />
          <stop offset="100%" stopColor={theme.sun} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1000" height="700" fill={`url(#${gradId})`} />

      <g fill="#F6E7BE" opacity={theme.stars}>
        <circle cx="70" cy="70" r="1.6" />
        <circle cx="200" cy="45" r="1.2" />
        <circle cx="330" cy="100" r="1.4" />
        <circle cx="470" cy="35" r="1.1" />
        <circle cx="600" cy="65" r="1.5" />
        <circle cx="740" cy="40" r="1.2" />
        <circle cx="860" cy="90" r="1.5" />
        <circle cx="950" cy="55" r="1.3" />
      </g>

      {id !== "exodo" && (
        <>
          <circle cx="500" cy="440" r="210" fill={`url(#${sunId})`} />
          <circle cx="500" cy="440" r="72" fill={theme.sun} opacity="0.88" />
        </>
      )}

      <path
        d="M0,480 L90,405 L170,458 L260,372 L345,438 L435,362 L525,445 L615,382 L705,452 L800,392 L900,448 L1000,415 L1000,700 L0,700 Z"
        fill="#2c2015"
        opacity="0.5"
      />
      <path
        d="M0,545 Q130,468 250,530 T500,518 T750,540 T1000,505 L1000,700 L0,700 Z"
        fill="#221809"
        opacity="0.72"
      />

      <LandscapeForeground id={id} />

      <path
        d="M0,615 Q160,562 330,602 T660,592 T1000,612 L1000,700 L0,700 Z"
        fill="#160f07"
        opacity="0.9"
      />
    </svg>
  );
}

function Backdrop({ children, landscapeId = "general" }) {
  return (
    <div style={{ minHeight: "100%", width: "100%", background: "#15100b", position: "relative", overflow: "hidden", fontFamily: "'Inter', sans-serif", color: "#EDE3CD" }}>
      <Landscape id={landscapeId} />
      <div
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(12,8,5,.55) 0%, rgba(12,8,5,.15) 38%, rgba(12,8,5,.2) 70%, rgba(12,8,5,.6) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage:
            "radial-gradient(1px 1px at 10% 20%, rgba(255,224,168,.55) 0, transparent 60%)," +
            "radial-gradient(1px 1px at 80% 10%, rgba(255,224,168,.45) 0, transparent 60%)," +
            "radial-gradient(1.5px 1.5px at 60% 70%, rgba(255,224,168,.4) 0, transparent 60%)," +
            "radial-gradient(1px 1px at 30% 85%, rgba(255,224,168,.45) 0, transparent 60%)," +
            "radial-gradient(1px 1px at 90% 60%, rgba(255,224,168,.35) 0, transparent 60%)," +
            "radial-gradient(1.5px 1.5px at 45% 35%, rgba(255,224,168,.35) 0, transparent 60%)",
          opacity: 0.6,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

function Welcome({ onStart, coins, onOpenShop, isPremium, onOpenPremium, totalQuestions, canClaimDaily, onOpenDaily, soundMuted, onToggleMute, musicOn, onToggleMusic }) {
  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.9 }}>
        <SceneArt id="vida_jesus" accent="#C9A227" opacity={0.22} />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ paddingTop: 20 }}>
          <TopBar coins={coins} onOpenShop={onOpenShop} isPremium={isPremium} onOpenPremium={onOpenPremium} canClaimDaily={canClaimDaily} onOpenDaily={onOpenDaily} soundMuted={soundMuted} onToggleMute={onToggleMute} musicOn={musicOn} onToggleMusic={onToggleMusic} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px 60px", textAlign: "center", minHeight: "calc(100vh - 56px)" }}>
          <div style={{ width: 78, height: 78, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #E8C26D, #A9791F 75%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22, boxShadow: "0 8px 28px rgba(201,162,39,.4), inset 0 2px 4px rgba(255,255,255,.4)" }}>
            <Scroll size={36} color="#2c2211" />
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px, 6vw, 48px)", letterSpacing: "0.03em", color: "#F2E6C9", textShadow: "0 2px 16px rgba(201,162,39,.3)", lineHeight: 1.15 }}>
            DESAFÍO<br />BÍBLICO
          </div>
          <p style={{ marginTop: 16, maxWidth: 440, fontSize: 18, color: "#C7BBA0", lineHeight: 1.55 }}>
            Ocho grandes tramos de la historia sagrada, de la Creación a Apocalipsis
            &mdash; {totalQuestions} preguntas en total. Avanza de nivel, gana monedas
            y estampa tu sello en cada respuesta.
          </p>
          <button
            onClick={() => { playClick(); onStart(); }}
            style={{ marginTop: 34, display: "inline-flex", alignItems: "center", gap: 10, background: "linear-gradient(180deg, #E8C26D, #B4881F)", color: "#241D0C", fontFamily: "'Playfair Display', serif", fontSize: 16, letterSpacing: "0.06em", fontWeight: 600, padding: "14px 32px", borderRadius: 999, border: "none", cursor: "pointer", boxShadow: "0 10px 26px rgba(201,162,39,.35)" }}
          >
            <Play size={18} fill="#241D0C" /> COMENZAR
          </button>
          <p style={{ marginTop: 22, fontSize: 12, color: "#6b6350", letterSpacing: "0.03em" }}>Gratis · sin registro · progreso guardado en este dispositivo</p>
        </div>
      </div>
    </div>
  );
}

function LevelMap({ progress, onPick, onOpenShop, onOpenPremium, canClaimDaily, onOpenDaily, soundMuted, onToggleMute, musicOn, onToggleMusic }) {
  const clearedCount = Object.keys(progress.completed).length;
  return (
    <div style={{ minHeight: "100vh", padding: "22px 18px 60px" }}>
      <TopBar coins={progress.coins} onOpenShop={onOpenShop} isPremium={progress.isPremium} onOpenPremium={onOpenPremium} canClaimDaily={canClaimDaily} onOpenDaily={onOpenDaily} soundMuted={soundMuted} onToggleMute={onToggleMute} musicOn={musicOn} onToggleMusic={onToggleMusic} />

      <div style={{ maxWidth: 640, margin: "6px auto 26px" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 4.5vw, 30px)", color: "#F2E6C9" }}>Mapa de niveles</div>
        <p style={{ color: "#9C927B", marginTop: 6, fontSize: 14 }}>{clearedCount} de {CATEGORIES.length} eras completadas · {CATEGORIES[0].questions.length} preguntas por nivel</p>
        <div style={{ height: 5, width: "100%", background: "rgba(237,227,205,.1)", borderRadius: 4, overflow: "hidden", marginTop: 12 }}>
          <div style={{ height: "100%", width: `${(clearedCount / CATEGORIES.length) * 100}%`, background: "linear-gradient(90deg, #E8C26D, #B4881F)", transition: "width .5s ease" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16, maxWidth: 640, margin: "0 auto" }}>
        {CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          const unlocked = i <= progress.unlockedIndex;
          const cleared = !!progress.completed[cat.id];
          return (
            <button
              key={cat.id}
              disabled={!unlocked}
              onClick={() => { if (unlocked) { playClick(); onPick(cat, i); } }}
              style={{
                textAlign: "left", position: "relative", overflow: "hidden",
                borderRadius: 14, padding: "22px 20px", cursor: unlocked ? "pointer" : "not-allowed",
                border: `1px solid ${unlocked ? cat.accent + "55" : "rgba(237,227,205,.12)"}`,
                background: cleared ? `${cat.accent}14` : "rgba(237,227,205,.04)",
                filter: unlocked ? "none" : "grayscale(0.7)",
                opacity: unlocked ? 1 : 0.55,
                transition: "transform .18s ease, box-shadow .18s ease",
              }}
              onMouseEnter={(e) => { if (unlocked) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 14px 30px ${cat.accent}22`; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <SceneArt id={cat.scene} accent={cat.accent} opacity={unlocked ? 0.24 : 0.08} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: `${cat.accent}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {unlocked ? <Icon size={22} color={cat.accent} /> : <Lock size={20} color="#8a8272" />}
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, color: "#9C927B" }}>NIVEL {i + 1}</div>
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "#F2E6C9", marginBottom: 6 }}>{cat.name}</div>
                <div style={{ fontSize: 13.5, color: "#9C927B", lineHeight: 1.4, marginBottom: 10 }}>{cat.subtitle}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {cleared ? (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "#5B7B5A", fontFamily: "'Playfair Display', serif" }}>
                      <Check size={13} /> COMPLETADO
                    </div>
                  ) : (
                    <span style={{ fontSize: 11.5, color: "#8a8272" }}>{cat.questions.length} preguntas</span>
                  )}
                  {unlocked && <ChevronRight size={16} color={cat.accent} />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Game({ category, theme, onFinish, isPremium, coins, onSpendCoins, onNeedCoins, shopOpen }) {
  const [order] = useState(() => shuffle(category.questions));
  const [idx, setIdx] = useState(0);
  const [lives, setLives] = useState(LIVES_START);
  const [score, setScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [reviveOffer, setReviveOffer] = useState(false);
  const [reviveUsed, setReviveUsed] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const lockedRef = useRef(false);
  const pendingFinishRef = useRef(null);

  const current = order[idx];

  const finishNow = useCallback(
    (finalScore, finalCoins, finalLives) => {
      onFinish({ score: finalScore, coins: finalCoins, total: order.length, answered: idx + 1, lives: finalLives });
    },
    [idx, order.length, onFinish]
  );

  const goNext = useCallback(
    (finalLives, finalScore, finalCoins) => {
      if (finalLives <= 0 && !reviveUsed) {
        pendingFinishRef.current = { score: finalScore, coins: finalCoins };
        setReviveOffer(true);
        return;
      }
      if (idx + 1 >= order.length || finalLives <= 0) {
        finishNow(finalScore, finalCoins, finalLives);
      } else {
        setIdx((i) => i + 1);
        setSelected(null);
        setStatus(null);
        setTimeLeft(TIME_PER_QUESTION);
        lockedRef.current = false;
      }
    },
    [idx, order.length, finishNow, reviveUsed]
  );

  const handleAnswer = useCallback(
    (optionIndex) => {
      if (lockedRef.current) return;
      lockedRef.current = true;
      setSelected(optionIndex);
      const isCorrect = optionIndex === current.correct;
      const newStreak = isCorrect ? streak + 1 : 0;
      const bonus = isCorrect ? 100 + newStreak * 15 + Math.round(timeLeft * 2) : 0;
      const newScore = score + bonus;
      const newCoins = coinsEarned + (isCorrect ? COINS_PER_CORRECT : 0);
      const newLives = isCorrect ? lives : lives - 1;

      isCorrect ? playCorrect() : playWrong();
      setStatus(isCorrect ? "correct" : "wrong");
      setStreak(newStreak);
      setScore(newScore);
      setCoinsEarned(newCoins);
      setLives(newLives);

      setTimeout(() => goNext(newLives, newScore, newCoins), 850);
    },
    [current, streak, score, coinsEarned, lives, timeLeft, goNext]
  );

  useEffect(() => {
    if (status || reviveOffer || showAd) return;
    if (timeLeft <= 0) {
      handleAnswer(-1);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, status, reviveOffer, showAd, handleAnswer]);

  function acceptRevive() {
    if (isPremium) {
      grantRevive();
    } else {
      setShowAd(true);
    }
  }

  function grantRevive() {
    setShowAd(false);
    setReviveOffer(false);
    setReviveUsed(true);
    setLives(1);
    setSelected(null);
    setStatus(null);
    setTimeLeft(TIME_PER_QUESTION);
    lockedRef.current = false;
    if (idx + 1 < order.length) {
      setIdx((i) => i + 1);
    } else {
      finishNow(score, coinsEarned, 1);
    }
  }

  function reviveWithCoins() {
    onSpendCoins(REVIVE_COST_COINS);
    grantRevive();
  }

  function declineRevive() {
    setReviveOffer(false);
    const p = pendingFinishRef.current || { score, coins: coinsEarned };
    finishNow(p.score, p.coins, 0);
  }

  const pct = (timeLeft / TIME_PER_QUESTION) * 100;
  const accent = category.accent;

  return (
    <div style={{ minHeight: "100vh", padding: "26px 18px 50px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      {showAd && <AdModal onClose={() => setShowAd(false)} onReward={grantRevive} rewardLabel="¡Recuperaste una vida!" />}

      {reviveOffer && !showAd && !shopOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,10,6,.8)", zIndex: 95, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ maxWidth: 320, background: "linear-gradient(160deg, #3c2a1a, #1e150d)", border: "1px solid rgba(240,200,105,.3)", borderRadius: 16, padding: 26, textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "#F2E6C9", marginBottom: 10 }}>Te quedaste sin vidas</div>
            <p style={{ color: "#9C927B", fontSize: 14, marginBottom: 18, lineHeight: 1.5 }}>
              {isPremium ? "Como usuario premium, revive al instante sin anuncios." : "Elegí cómo continuar el desafío con una vida extra."}
            </p>
            {isPremium ? (
              <button onClick={acceptRevive} style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "linear-gradient(180deg, #E8C26D, #B4881F)", color: "#241D0C", fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 600, padding: "12px 18px", borderRadius: 999, border: "none", cursor: "pointer", marginBottom: 10 }}>
                <Sparkles size={15} /> REVIVIR AL INSTANTE
              </button>
            ) : (
              <>
                <button onClick={acceptRevive} style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "linear-gradient(180deg, #E8C26D, #B4881F)", color: "#241D0C", fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 600, padding: "12px 18px", borderRadius: 999, border: "none", cursor: "pointer", marginBottom: 8 }}>
                  <Gift size={15} /> VER ANUNCIO Y REVIVIR
                </button>

                {coins >= REVIVE_COST_COINS ? (
                  <button onClick={reviveWithCoins} style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(240,200,105,.12)", color: "#F0C869", fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 600, padding: "12px 18px", borderRadius: 999, border: "1.5px solid rgba(240,200,105,.4)", cursor: "pointer", marginBottom: 10 }}>
                    <Coins size={15} /> REVIVIR CON {REVIVE_COST_COINS} MONEDAS
                  </button>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, background: "rgba(237,227,205,.05)", border: "1px solid rgba(237,227,205,.15)", borderRadius: 999, padding: "8px 8px 8px 14px", marginBottom: 10 }}>
                    <span style={{ fontSize: 11.5, color: "#8a8272", textAlign: "left" }}>
                      Revivir con monedas: faltan {REVIVE_COST_COINS - coins}
                    </span>
                    <button onClick={() => onNeedCoins(REVIVE_COST_COINS)} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(240,200,105,.16)", color: "#F0C869", fontFamily: "'Playfair Display', serif", fontSize: 11, fontWeight: 600, padding: "7px 11px", borderRadius: 999, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
                      <Coins size={12} /> Comprar
                    </button>
                  </div>
                )}
              </>
            )}
            <button onClick={declineRevive} style={{ width: "100%", background: "none", color: "#9C927B", fontFamily: "'Playfair Display', serif", fontSize: 12.5, padding: "10px 18px", borderRadius: 999, border: "1px solid rgba(237,227,205,.2)", cursor: "pointer" }}>
              Ver resultados
            </button>
          </div>
        </div>
      )}

      <div style={{ width: "100%", maxWidth: 560, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: LIVES_START }).map((_, i) => (
            <LampLife key={i} lit={i < lives} />
          ))}
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "#9C927B", letterSpacing: "0.08em" }}>{category.name.toUpperCase()}</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#F0C869" }}>{score} pts</div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {order.map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < idx ? accent : i === idx ? "#F2E6C9" : "rgba(237,227,205,.2)", transition: "background .3s ease" }} />
        ))}
      </div>

      {streak >= 2 && (
        <div style={{ marginBottom: 12, fontSize: 13, color: "#F0C869", fontFamily: "'Playfair Display', serif", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles size={14} /> RACHA x{streak}
        </div>
      )}

      <div style={{ position: "relative", width: "100%", maxWidth: 560, borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,.45)", border: `1px solid ${accent}66` }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #EDE3CD, #E2D4B4)" }} />
        <SceneArt id={category.scene} accent={accent} opacity={0.16} />
        <div style={{ position: "relative", padding: "30px 26px 26px" }}>
          <WaxSeal status={status} theme={theme} />

          <div style={{ height: 4, width: "100%", background: "rgba(60,45,20,.15)", borderRadius: 4, overflow: "hidden", marginBottom: 20 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct > 30 ? accent : "#9B3A2E", transition: "width 1s linear" }} />
          </div>

          <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "#8a7550", fontFamily: "'Playfair Display', serif", marginBottom: 10 }}>
            PREGUNTA {idx + 1} DE {order.length}
          </div>

          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 600, color: "#2C2211", lineHeight: 1.35, marginBottom: 22, minHeight: 62 }}>
            {current.q}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {current.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrectOpt = status && i === current.correct;
              const isWrongSelected = status && isSelected && i !== current.correct;
              let bg = "rgba(60,45,20,.06)";
              let border = "rgba(60,45,20,.18)";
              if (isCorrectOpt) { bg = "#5B7B5A22"; border = "#5B7B5A"; }
              else if (isWrongSelected) { bg = "#9B3A2E22"; border = "#9B3A2E"; }
              return (
                <button
                  key={i}
                  disabled={!!status}
                  onClick={() => handleAnswer(i)}
                  style={{ textAlign: "left", padding: "14px 14px", borderRadius: 10, background: bg, border: `1.5px solid ${border}`, color: "#2C2211", fontFamily: "'Inter', sans-serif", fontSize: 15.5, fontWeight: 500, cursor: status ? "default" : "pointer", lineHeight: 1.3, transition: "background .2s ease, border-color .2s ease" }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {status && (
            <div style={{ marginTop: 18, fontSize: 13, color: "#8a7550", fontStyle: "italic", textAlign: "right" }}>{current.ref}</div>
          )}
        </div>
      </div>
    </div>
  );
}

const MEDAL_THRESHOLDS = [
  { min: 1400, label: "Sello de Oro", grad: "radial-gradient(circle at 35% 30%, #F0D48A, #B4881F 75%)" },
  { min: 900, label: "Sello de Plata", grad: "radial-gradient(circle at 35% 30%, #D9DCE2, #8A8F99 75%)" },
  { min: 0, label: "Sello de Bronce", grad: "radial-gradient(circle at 35% 30%, #D9A272, #8A5A34 75%)" },
];

function Results({ result, unlockedNext, onRestart, onMenu }) {
  const { score, total, answered, coins, perfectBonus } = result;
  const won = answered >= total;
  const medal = won ? MEDAL_THRESHOLDS.find((m) => score >= m.min) : null;
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 20px", textAlign: "center" }}>
      <div style={{ width: 84, height: 84, borderRadius: "50%", background: won ? medal.grad : "radial-gradient(circle at 35% 30%, #b0503c, #6e2c1f 75%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22, boxShadow: "0 8px 24px rgba(0,0,0,.35)" }}>
        <Trophy size={36} color="#241D0C" />
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, letterSpacing: "0.12em", color: "#9C927B" }}>
        {won ? medal.label.toUpperCase() : "EL SELLO SE ROMPIÓ"}
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px, 8vw, 56px)", color: "#F2E6C9", margin: "10px 0 6px" }}>{score}</div>
      <div style={{ color: "#C7BBA0", fontSize: 16, marginBottom: 10 }}>{answered} de {total} preguntas respondidas</div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#F0C869", fontFamily: "'Playfair Display', serif", fontSize: 14, marginBottom: 6 }}>
        <Coins size={16} /> +{coins} monedas ganadas
      </div>
      {won && perfectBonus > 0 && (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#F0C869", fontFamily: "'Playfair Display', serif", fontSize: 13, marginBottom: 6 }}>
          <Sparkles size={13} /> Racha perfecta: +{perfectBonus} monedas bono
        </div>
      )}
      {won && unlockedNext && (
        <div style={{ color: "#5B7B5A", fontFamily: "'Playfair Display', serif", fontSize: 13.5, marginTop: 4, marginBottom: 30, display: "flex", alignItems: "center", gap: 6 }}>
          <Check size={15} /> Siguiente nivel desbloqueado
        </div>
      )}
      {!(won && unlockedNext) && <div style={{ marginBottom: 24 }} />}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={() => { playClick(); onRestart(); }} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(180deg, #E8C26D, #B4881F)", color: "#241D0C", fontFamily: "'Playfair Display', serif", fontSize: 14, letterSpacing: "0.05em", fontWeight: 600, padding: "13px 24px", borderRadius: 999, border: "none", cursor: "pointer" }}>
          <RotateCcw size={16} /> JUGAR DE NUEVO
        </button>
        <button onClick={() => { playClick(); onMenu(); }} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "#EDE3CD", fontFamily: "'Playfair Display', serif", fontSize: 14, letterSpacing: "0.05em", fontWeight: 600, padding: "13px 24px", borderRadius: 999, border: "1.5px solid rgba(237,227,205,.35)", cursor: "pointer" }}>
          MAPA DE NIVELES
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ROOT                                                                */
/* ------------------------------------------------------------------ */

export default function DesafioBiblico() {
  const [loaded, setLoaded] = useState(false);
  const [screen, setScreen] = useState("welcome");
  const [category, setCategory] = useState(null);
  const [categoryIdx, setCategoryIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [gameKey, setGameKey] = useState(0);
  const [showShop, setShowShop] = useState(false);
  const [shopAd, setShopAd] = useState(false);
  const [showDaily, setShowDaily] = useState(false);
  const [purchaseTarget, setPurchaseTarget] = useState(null); // null | { type: "premium" } | { type: "coins", pkg }
  const [shopInitial, setShopInitial] = useState(null); // { tab, suggestedPkgId, origin } | null
  const [lastPurchaseAt, setLastPurchaseAt] = useState(0); // ticks on every completed purchase, lets Shop react to its own outcome
  const [soundMuted, setSoundMuted] = useState(false);
  const [musicOn, setMusicOn] = useState(true);

  const [progress, setProgress] = useState({ ...DEFAULT_PROGRESS });

  useEffect(() => {
    setSoundMuted(loadMutePref());
    setMusicOn(loadMusicPref());
    (async () => {
      const p = await loadProgress();
      setProgress(p);
      setLoaded(true);
      if (p.lastClaimDate !== todayStr()) {
        setShowDaily(true);
      }
    })();
  }, []);

  // Las políticas de autoplay del navegador exigen un gesto del usuario antes
  // de poder reproducir audio, así que arrancamos la música apenas ocurra la
  // primera interacción (clic o toque) en cualquier parte de la app.
  useEffect(() => {
    if (!musicOn) return;
    let started = false;
    const tryStart = () => {
      if (started) return;
      started = true;
      startMusic();
      window.removeEventListener("pointerdown", tryStart);
      window.removeEventListener("keydown", tryStart);
    };
    window.addEventListener("pointerdown", tryStart);
    window.addEventListener("keydown", tryStart);
    return () => {
      window.removeEventListener("pointerdown", tryStart);
      window.removeEventListener("keydown", tryStart);
    };
  }, [musicOn]);

  function handleToggleMute() {
    setSoundMuted(toggleMuted());
  }

  function handleToggleMusic() {
    setMusicOn(toggleMusicEnabled());
  }

  function persist(next) {
    setProgress(next);
    saveProgress(next);
  }

  function handleFinish(res) {
    const won = res.answered >= res.total;
    const idx = categoryIdx;
    const perfect = won && res.lives === LIVES_START;
    const perfectBonus = perfect ? COINS_PERFECT_BONUS : 0;
    won ? playLevelComplete() : playGameOver();
    setResult({ ...res, perfectBonus });
    const next = {
      ...progress,
      coins: progress.coins + res.coins,
      completed: won ? { ...progress.completed, [category.id]: true } : progress.completed,
      unlockedIndex: won ? Math.max(progress.unlockedIndex, Math.min(idx + 1, CATEGORIES.length - 1)) : progress.unlockedIndex,
    };
    if (won) next.coins += COINS_LEVEL_CLEAR + perfectBonus;
    persist(next);
    setScreen("results");
  }

  function buyTheme(t) {
    if (t.cost === 0 || progress.themeId === t.id) {
      persist({ ...progress, themeId: t.id });
      return;
    }
    if (progress.coins >= t.cost) {
      persist({ ...progress, coins: progress.coins - t.cost, themeId: t.id });
    }
  }

  const canClaimDaily = progress.lastClaimDate !== todayStr();
  const claimStreakDay = (() => {
    const isConsecutive = progress.lastClaimDate === yesterdayStr();
    const newStreak = isConsecutive ? progress.dailyStreak + 1 : 1;
    return ((newStreak - 1) % DAILY_REWARDS.length) + 1;
  })();
  const claimReward = DAILY_REWARDS[claimStreakDay - 1];

  function claimDaily() {
    const isConsecutive = progress.lastClaimDate === yesterdayStr();
    const newStreak = isConsecutive ? progress.dailyStreak + 1 : 1;
    const reward = DAILY_REWARDS[(newStreak - 1) % DAILY_REWARDS.length];
    playCoin();
    persist({ ...progress, coins: progress.coins + reward, dailyStreak: newStreak, lastClaimDate: todayStr() });
    setShowDaily(false);
  }

  function purchasePremium() {
    persist({ ...progress, isPremium: true, coins: progress.coins + 500 });
    setPurchaseTarget(null);
    setLastPurchaseAt(Date.now());
  }

  function purchaseCoins(pkg) {
    persist({ ...progress, coins: progress.coins + pkg.coins + pkg.bonus });
    setPurchaseTarget(null);
    setLastPurchaseAt(Date.now());
  }

  function spendCoins(amount) {
    persist({ ...progress, coins: Math.max(0, progress.coins - amount) });
  }

  function openCoinShopFor(neededTotal, origin) {
    setShopInitial({ tab: "monedas", suggestedPkgId: suggestCoinPackage(neededTotal - progress.coins), origin: origin || null });
    setShowShop(true);
  }

  function openPremiumShop() {
    setShopInitial({ tab: "premium", origin: null });
    setShowShop(true);
  }

  const activeTheme = THEMES.find((t) => t.id === progress.themeId) || THEMES[0];
  const unlockedNextAfterResult = result && category ? categoryIdx + 1 <= progress.unlockedIndex : false;
  const activeLandscapeId = (screen === "game" || screen === "results") && category ? category.scene : "general";

  if (!loaded) {
    return (
      <Backdrop>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#9C927B", fontFamily: "'Playfair Display', serif", fontSize: 13, letterSpacing: "0.1em" }}>
          CARGANDO PERGAMINO…
        </div>
      </Backdrop>
    );
  }

  return (
    <Backdrop landscapeId={activeLandscapeId}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes sealPop { 0% { transform: scale(0.3) rotate(-8deg); opacity: 0; } 55% { transform: scale(1.06) rotate(1deg); opacity: 1; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .seal-stamp { animation: sealPop .24s cubic-bezier(.2,1.4,.4,1) both; }
        @keyframes shopGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(240,200,105,0); } 50% { box-shadow: 0 0 0 6px rgba(240,200,105,.22); } }
        .shop-highlight { animation: shopGlow 1.1s ease-in-out; }
        @media (prefers-reduced-motion: reduce) { .seal-stamp, .shop-highlight { animation: none; } }
        button:focus-visible { outline: 2px solid #F0C869; outline-offset: 2px; }
      `}</style>

      {screen === "welcome" && (
        <Welcome
          onStart={() => setScreen("levelmap")}
          coins={progress.coins}
          onOpenShop={() => setShowShop(true)}
          isPremium={progress.isPremium}
          onOpenPremium={openPremiumShop}
          totalQuestions={CATEGORIES.reduce((sum, c) => sum + c.questions.length, 0)}
          canClaimDaily={canClaimDaily}
          onOpenDaily={() => setShowDaily(true)}
          soundMuted={soundMuted}
          onToggleMute={handleToggleMute}
          musicOn={musicOn}
          onToggleMusic={handleToggleMusic}
        />
      )}

      {screen === "levelmap" && (
        <LevelMap
          progress={progress}
          onOpenShop={() => setShowShop(true)}
          onOpenPremium={openPremiumShop}
          canClaimDaily={canClaimDaily}
          onOpenDaily={() => setShowDaily(true)}
          soundMuted={soundMuted}
          onToggleMute={handleToggleMute}
          musicOn={musicOn}
          onToggleMusic={handleToggleMusic}
          onPick={(cat, i) => {
            setCategory(cat);
            setCategoryIdx(i);
            setGameKey((k) => k + 1);
            setScreen("game");
          }}
        />
      )}

      {screen === "game" && category && (
        <Game
          key={gameKey}
          category={category}
          theme={activeTheme}
          onFinish={handleFinish}
          isPremium={progress.isPremium}
          coins={progress.coins}
          onSpendCoins={spendCoins}
          onNeedCoins={(needed) => openCoinShopFor(needed, { kind: "revive" })}
          shopOpen={showShop}
        />
      )}

      {screen === "results" && result && (
        <Results
          result={result}
          unlockedNext={unlockedNextAfterResult}
          onRestart={() => { setGameKey((k) => k + 1); setScreen("game"); }}
          onMenu={() => setScreen("levelmap")}
        />
      )}

      {showShop && (
        <Shop
          coins={progress.coins}
          themeId={progress.themeId}
          onBuyTheme={buyTheme}
          onClose={() => { setShowShop(false); setShopInitial(null); }}
          onOpenAd={() => setShopAd(true)}
          isPremium={progress.isPremium}
          onOpenPurchase={() => setPurchaseTarget({ type: "premium" })}
          onBuyCoinPackage={(pkg) => setPurchaseTarget({ type: "coins", pkg })}
          initialTab={shopInitial?.tab}
          initialSuggestedPkgId={shopInitial?.suggestedPkgId}
          initialOrigin={shopInitial?.origin}
          lastPurchaseAt={lastPurchaseAt}
        />
      )}

      {shopAd && (
        <AdModal
          onClose={() => setShopAd(false)}
          rewardLabel="¡Ganaste 30 monedas!"
          onReward={() => { playCoin(); persist({ ...progress, coins: progress.coins + 30 }); setShopAd(false); }}
        />
      )}

      {showDaily && (
        <DailyRewardModal
          streakDay={claimStreakDay}
          reward={claimReward}
          onClaim={claimDaily}
          onClose={() => setShowDaily(false)}
        />
      )}

      {purchaseTarget && purchaseTarget.type === "premium" && (
        <PaymentModal
          onClose={() => setPurchaseTarget(null)}
          onSuccess={purchasePremium}
          successText="Sin anuncios activado y 500 monedas añadidas a tu cofre."
        />
      )}

      {purchaseTarget && purchaseTarget.type === "coins" && (
        <PaymentModal
          onClose={() => setPurchaseTarget(null)}
          onSuccess={() => purchaseCoins(purchaseTarget.pkg)}
          successText={`${purchaseTarget.pkg.coins + purchaseTarget.pkg.bonus} monedas añadidas a tu cofre.`}
        />
      )}
    </Backdrop>
  );
}
