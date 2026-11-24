import type { Course, Question } from '../types/domain';

/**
 * Catálogo de contenido de Mi Mundo Aprende.
 *
 * Objetivo: introducción temprana al temario del prospecto UNMSM, repartida por
 * grados (3.°, 4.° y 5.° de primaria). Cada tema tiene su parte teórica
 * (`theory`) que se muestra antes de practicar.
 *
 * Los 12 cursos del alcance: Aritmética, Geometría, Razonamiento Matemático,
 * Razonamiento Verbal, Lenguaje, Literatura, Historia, Geografía, Educación
 * Cívica, Álgebra, Física y Biología.
 *
 * Estado de cobertura (ejemplo completo por área):
 *   - Matemática → Aritmética COMPLETO (teoría + preguntas, 3.°-5.°).
 *   - Habilidades → Razonamiento Verbal COMPLETO.
 *   - Comunicación → Lenguaje COMPLETO.
 *   - Ciencias Sociales → Historia del Perú COMPLETO.
 *   - Persona/Familia → Educación Cívica COMPLETO.
 *   - Ciencias Naturales → Biología COMPLETO.
 *   - Un curso se publica solo si cubre 3.°, 4.° y 5.° con teoría. Los demás salen como
 *     "Próximamente": Geometría y Razonamiento Matemático (solo 3.° y 4.°, sin teoría),
 *     Literatura, Álgebra, Física y Geografía (sin contenido aún).
 *
 * IMPORTANTE: `Topic.skill` debe coincidir con `Question.skill` para el motor
 * adaptativo (racha por habilidad) y el reporte de fortalezas/debilidades.
 *
 * NOTA PEDAGÓGICA: contenido base de trabajo, pendiente de validación docente (RF-09).
 */

const GRADE = '4.° grado';

export const CURRICULUM: Course[] = [
  // ============================= MATEMÁTICA =============================
  {
    id: 'aritmetica',
    name: 'Aritmética',
    area: 'Matemática',
    grade: GRADE,
    icon: '🔢',
    color: '#f05b45',
    status: 'active',
    description: 'Números, operaciones, divisibilidad y fracciones.',
    topics: [
      {
        id: 'numeracion', name: 'Números y valor posicional', skill: 'Numeración',
        description: 'Cuánto vale cada dígito según su lugar.', grade: 3,
        theory: {
          intro: 'Cada dígito de un número vale según el lugar que ocupa: unidades, decenas o centenas.',
          blocks: [
            { heading: 'El valor del lugar', text: 'En 345, el 3 vale 300 (centenas), el 4 vale 40 (decenas) y el 5 vale 5 (unidades).' },
            { heading: 'Leer números', text: 'Juntamos los valores: 345 se lee "trescientos cuarenta y cinco".' },
          ],
          example: { problem: 'En el número 672, ¿cuánto vale el 7?', solution: 'El 7 está en las decenas, así que vale 70.' },
          keyIdea: 'El lugar de un dígito decide cuánto vale.',
        },
        questions: [
          { id: 40, skill: 'Numeración', difficulty: 1, prompt: 'En el número 345, ¿cuánto vale el 4?', options: ['4', '40', '400', '44'], answer: '40', hint: 'El 4 está en el lugar de las decenas.' },
          { id: 41, skill: 'Numeración', difficulty: 1, prompt: '¿Cómo se escribe "doscientos ocho"?', options: ['28', '280', '208', '2008'], answer: '208', hint: '2 centenas, 0 decenas y 8 unidades.' },
          { id: 42, skill: 'Numeración', difficulty: 2, prompt: 'En 672, ¿cuánto vale el 6?', options: ['6', '60', '600', '66'], answer: '600', hint: 'El 6 está en las centenas.' },
          { id: 43, skill: 'Numeración', difficulty: 2, prompt: '¿Qué número tiene 5 centenas, 0 decenas y 3 unidades?', options: ['53', '503', '530', '5003'], answer: '503', hint: 'Es 500 + 3.' },
        ],
      },
      {
        id: 'multiplicacion', name: 'Multiplicación', skill: 'Multiplicación',
        description: 'Agrupar y repetir para multiplicar.', grade: 3,
        theory: {
          intro: 'Multiplicar es una forma rápida de sumar el mismo número varias veces.',
          blocks: [
            { heading: '¿Qué significa?', text: '3 × 4 quiere decir "3 grupos de 4". En vez de sumar 4 + 4 + 4, multiplicas y listo.' },
            { heading: 'Cómo se lee', text: 'El signo × se lee "por" o "veces". Entonces 3 × 4 es "3 veces 4".' },
          ],
          example: { problem: 'Tienes 3 cajas y en cada una hay 4 lápices. ¿Cuántos lápices hay en total?', solution: '3 × 4 = 12 lápices. Es lo mismo que 4 + 4 + 4 = 12.' },
          keyIdea: 'Multiplicar = sumar grupos iguales, pero mucho más rápido.',
        },
        questions: [
          { id: 1, skill: 'Multiplicación', difficulty: 1, prompt: '¿Cuánto es 6 × 4?', narrative_variants: { neutral: '¿Cuánto es 6 × 4?', ki_warriors: 'El Maestro pregunta: ¿cuánto es 6 × 4?', super_league: 'El entrenador pregunta: ¿cuánto es 6 × 4?', block_builders: 'Tu bloque necesita resolver: ¿cuánto es 6 × 4?' }, options: ['18', '24', '28', '32'], answer: '24', hint: 'Piensa en 6 grupos de 4.' },
          { id: 7, skill: 'Multiplicación', difficulty: 1, prompt: '¿Cuánto es 7 × 3?', options: ['18', '21', '24', '28'], answer: '21', hint: 'Suma 7 tres veces.' },
          { id: 16, skill: 'Multiplicación', difficulty: 2, prompt: '¿Cuánto es 8 × 5?', options: ['35', '40', '45', '48'], answer: '40', hint: 'Cuenta de 5 en 5 ocho veces.' },
          { id: 13, skill: 'Multiplicación', difficulty: 2, prompt: '¿Cuánto es 12 × 4?', options: ['36', '40', '48', '52'], answer: '48', hint: 'Calcula 10 × 4 y suma 2 × 4.' },
          { id: 17, skill: 'Multiplicación', difficulty: 3, prompt: '¿Cuánto es 9 × 6?', options: ['45', '54', '56', '63'], answer: '54', hint: 'Es 10 × 6 menos 1 × 6.' },
        ],
      },
      {
        id: 'division', name: 'División', skill: 'División',
        description: 'Repartir en partes iguales.', grade: 4,
        theory: {
          intro: 'Dividir es repartir una cantidad en partes iguales.',
          blocks: [
            { heading: '¿Qué significa?', text: '12 ÷ 3 pregunta: "si reparto 12 en 3 grupos iguales, ¿cuántos van en cada grupo?". La respuesta es 4.' },
            { heading: 'El truco', text: 'Dividir es lo contrario de multiplicar. Como 3 × 4 = 12, entonces 12 ÷ 3 = 4.' },
          ],
          example: { problem: 'Tienes 20 galletas para repartir entre 5 amigos en partes iguales. ¿Cuántas recibe cada uno?', solution: '20 ÷ 5 = 4 galletas cada uno.' },
          keyIdea: 'Dividir = repartir en partes iguales. Es lo contrario de multiplicar.',
        },
        questions: [
          { id: 8, skill: 'División', difficulty: 1, prompt: '¿Cuánto es 45 ÷ 5?', options: ['7', '8', '9', '10'], answer: '9', hint: 'Busca qué número multiplicado por 5 da 45.' },
          { id: 19, skill: 'División', difficulty: 1, prompt: '¿Cuánto es 36 ÷ 6?', options: ['5', '6', '7', '8'], answer: '6', hint: 'Porque 6 × 6 = 36.' },
          { id: 4, skill: 'División', difficulty: 2, prompt: 'Completa: 72 ÷ 8 =', options: ['7', '8', '9', '10'], answer: '9', hint: '¿Qué número multiplicado por 8 da 72?' },
          { id: 14, skill: 'División', difficulty: 2, prompt: 'Completa: 56 ÷ 7 =', options: ['6', '7', '8', '9'], answer: '8', hint: '¿Qué número por 7 da 56?' },
          { id: 18, skill: 'División', difficulty: 2, prompt: '¿Cuánto es 64 ÷ 8?', options: ['6', '7', '8', '9'], answer: '8', hint: 'Porque 8 × 8 = 64.' },
        ],
      },
      {
        id: 'multiplos-divisores', name: 'Múltiplos y divisores', skill: 'Divisibilidad',
        description: 'Tablas, múltiplos y qué cabe exacto.', grade: 4,
        theory: {
          intro: 'Los múltiplos de un número salen de su tabla. Los divisores son los que caben exactos.',
          blocks: [
            { heading: 'Múltiplos', text: 'Los múltiplos de 3 son 3, 6, 9, 12, 15… (su tabla). Hay infinitos.' },
            { heading: 'Divisores', text: 'Los divisores de 12 son 1, 2, 3, 4, 6 y 12: dividen a 12 sin dejar resto.' },
          ],
          example: { problem: '¿Es 15 múltiplo de 5?', solution: 'Sí, porque 5 × 3 = 15. El 15 está en la tabla del 5.' },
          keyIdea: 'Múltiplo = está en la tabla. Divisor = cabe exacto, sin resto.',
        },
        questions: [
          { id: 44, skill: 'Divisibilidad', difficulty: 1, prompt: '¿Cuál de estos es un múltiplo de 4?', options: ['6', '10', '12', '14'], answer: '12', hint: '4 × 3 = 12.' },
          { id: 46, skill: 'Divisibilidad', difficulty: 1, prompt: 'Los primeros tres múltiplos de 5 son…', options: ['5, 10, 15', '1, 5, 10', '5, 6, 7', '0, 5, 25'], answer: '5, 10, 15', hint: 'Es la tabla del 5.' },
          { id: 45, skill: 'Divisibilidad', difficulty: 2, prompt: '¿Cuál NO es divisor de 12?', options: ['2', '3', '5', '6'], answer: '5', hint: '12 ÷ 5 deja resto, no cabe exacto.' },
          { id: 47, skill: 'Divisibilidad', difficulty: 2, prompt: '¿Cuántos divisores tiene el número 6?', options: ['2', '3', '4', '6'], answer: '4', hint: 'Son 1, 2, 3 y 6.' },
        ],
      },
      {
        id: 'leer-fracciones', name: 'Fracciones: leer y representar', skill: 'Fracciones',
        description: 'Partes iguales de un entero.', grade: 4,
        theory: {
          intro: 'Una fracción muestra partes iguales de un entero: arriba cuántas tomas; abajo, en cuántas partes se dividió.',
          blocks: [
            { heading: 'Las dos partes', text: 'En 3/4, el 4 (denominador) dice que el entero se partió en 4. El 3 (numerador) dice que tomas 3.' },
            { heading: 'Cómo se leen', text: '1/2 es "un medio", 1/3 "un tercio" y 1/4 "un cuarto".' },
          ],
          example: { problem: 'Si parto un chocolate en 4 trozos y como 1, ¿qué fracción comí?', solution: 'Comí 1/4: una de las cuatro partes iguales.' },
          keyIdea: 'Fracción = partes iguales: arriba cuántas tomas, abajo en cuántas se partió.',
        },
        questions: [
          { id: 2, skill: 'Fracciones', difficulty: 1, prompt: '¿Qué fracción representa la parte pintada?', narrative_variants: { neutral: '¿Qué fracción representa la parte pintada?', ki_warriors: 'Descubre qué fracción de energía está pintada.', super_league: 'Mira la cancha: ¿qué fracción está pintada?', block_builders: 'Identifica qué fracción del bloque está pintada.' }, visual: 'half', options: ['1/2', '1/3', '2/3', '3/4'], answer: '1/2', hint: 'El círculo está dividido en dos partes iguales y una está pintada.' },
          { id: 23, skill: 'Fracciones', difficulty: 1, prompt: 'Si parto una pizza en 4 trozos iguales y como 1, ¿qué fracción comí?', options: ['1/4', '1/2', '3/4', '4/1'], answer: '1/4', hint: 'Comiste 1 de 4 partes iguales.' },
          { id: 20, skill: 'Fracciones', difficulty: 2, prompt: '¿Qué fracción es la mitad de un entero?', options: ['1/2', '1/3', '1/4', '2/3'], answer: '1/2', hint: 'La mitad es una de dos partes iguales.' },
        ],
      },
      {
        id: 'mcd-mcm', name: 'MCD y MCM', skill: 'MCD y MCM',
        description: 'Divisor común mayor y múltiplo común menor.', grade: 5,
        theory: {
          intro: 'El MCD es el divisor común más grande; el MCM es el múltiplo común más pequeño de dos números.',
          blocks: [
            { heading: 'MCD (máximo común divisor)', text: 'Divisores de 12: 1,2,3,4,6,12. De 18: 1,2,3,6,9,18. El mayor que comparten es 6: ese es el MCD.' },
            { heading: 'MCM (mínimo común múltiplo)', text: 'Múltiplos de 4: 4,8,12… De 6: 6,12… El menor que comparten es 12: ese es el MCM.' },
          ],
          example: { problem: '¿Cuál es el MCM de 2 y 3?', solution: 'Múltiplos de 2: 2,4,6…; de 3: 3,6… El menor común es 6.' },
          keyIdea: 'MCD = el divisor común más grande. MCM = el múltiplo común más pequeño.',
        },
        questions: [
          { id: 50, skill: 'MCD y MCM', difficulty: 1, prompt: '¿Cuál es el MCM de 2 y 5?', options: ['7', '10', '15', '20'], answer: '10', hint: '2 × 5 = 10, y es múltiplo de ambos.' },
          { id: 48, skill: 'MCD y MCM', difficulty: 2, prompt: '¿Cuál es el MCD de 12 y 18?', options: ['2', '3', '6', '12'], answer: '6', hint: 'El mayor divisor que comparten.' },
          { id: 49, skill: 'MCD y MCM', difficulty: 2, prompt: '¿Cuál es el MCM de 4 y 6?', options: ['10', '12', '18', '24'], answer: '12', hint: 'El menor múltiplo común.' },
          { id: 51, skill: 'MCD y MCM', difficulty: 3, prompt: '¿Cuál es el MCD de 8 y 20?', options: ['2', '4', '8', '20'], answer: '4', hint: 'Divisores comunes: 1, 2 y 4. El mayor es 4.' },
        ],
      },
      {
        id: 'comparar-fracciones', name: 'Comparar fracciones', skill: 'Fracciones',
        description: '¿Cuál es mayor o menor?', grade: 5,
        theory: {
          intro: 'Para comparar fracciones del mismo entero, fíjate en el tamaño de las partes.',
          blocks: [
            { heading: 'Mismo numerador', text: 'Entre 1/3 y 1/5 gana 1/3: mientras MENOS partes, cada parte es más grande.' },
            { heading: 'Mismo denominador', text: 'Entre 3/4 y 1/4 gana 3/4: si las partes son iguales, gana quien toma más.' },
          ],
          example: { problem: '¿Cuál es mayor: 1/2 o 1/4?', solution: '1/2, porque partir en 2 da trozos más grandes que partir en 4.' },
          keyIdea: 'Menos partes = trozos más grandes. Con partes iguales, gana quien toma más.',
        },
        questions: [
          { id: 9, skill: 'Fracciones', difficulty: 2, prompt: '¿Cuál es mayor?', options: ['1/4', '1/2', '1/8', '1/10'], answer: '1/2', hint: 'Mientras menos partes, más grande es cada una.' },
          { id: 21, skill: 'Fracciones', difficulty: 2, prompt: '¿Cuál es mayor: 3/4 o 1/4?', options: ['3/4', '1/4', 'Son iguales', '1/2'], answer: '3/4', hint: 'Tienen el mismo tamaño de parte; gana quien tiene más.' },
          { id: 22, skill: 'Fracciones', difficulty: 3, prompt: '¿Cuál fracción es la menor?', options: ['1/2', '1/3', '1/5', '1/4'], answer: '1/5', hint: 'Mientras más partes, más pequeña es cada una.' },
        ],
      },
      {
        id: 'razones-porcentajes', name: 'Razones y porcentajes', skill: 'Proporciones',
        description: 'Comparar cantidades y partes de cada 100.', grade: 5,
        theory: {
          intro: 'Una razón compara dos cantidades. Un porcentaje es una parte de cada 100.',
          blocks: [
            { heading: 'Razón', text: 'Si hay 3 manzanas rojas por cada 1 verde, la razón de rojas a verdes es "3 a 1".' },
            { heading: 'Porcentaje', text: '50% significa "50 de cada 100", que es la mitad. 25% es la cuarta parte.' },
          ],
          example: { problem: '¿Cuánto es el 50% de 10?', solution: '50% es la mitad, y la mitad de 10 es 5.' },
          keyIdea: 'Razón = comparar dos cantidades. Porcentaje = partes de cada 100 (50% = la mitad).',
        },
        questions: [
          { id: 52, skill: 'Proporciones', difficulty: 1, prompt: '¿Cuánto es el 50% de 20?', options: ['5', '10', '15', '20'], answer: '10', hint: '50% es la mitad.' },
          { id: 55, skill: 'Proporciones', difficulty: 1, prompt: '¿Cuánto es el 100% de 7?', options: ['0', '1', '7', '70'], answer: '7', hint: '100% es el total completo.' },
          { id: 53, skill: 'Proporciones', difficulty: 2, prompt: '¿Cuánto es el 25% de 40?', options: ['4', '10', '20', '25'], answer: '10', hint: '25% es la cuarta parte.' },
          { id: 54, skill: 'Proporciones', difficulty: 2, prompt: 'Hay 3 manzanas rojas por cada 1 verde. ¿Cuál es la razón de rojas a verdes?', options: ['1 a 3', '3 a 1', '4 a 1', '2 a 2'], answer: '3 a 1', hint: '3 rojas por cada 1 verde.' },
        ],
      },
    ],
  },
  {
    id: 'geometria', name: 'Geometría', area: 'Matemática', grade: GRADE,
    icon: '📐', color: '#14b8a6', status: 'soon',
    description: 'Figuras, cuerpos, perímetro y área.',
    topics: [
      {
        id: 'figuras-cuerpos', name: 'Figuras y cuerpos', skill: 'Geometría',
        description: 'Lados, vértices y caras.', grade: 3,
        questions: [
          { id: 10, skill: 'Geometría', difficulty: 1, prompt: '¿Cuántos lados tiene un hexágono?', options: ['4', '5', '6', '8'], answer: '6', hint: 'Cuenta cada segmento del borde.' },
          { id: 26, skill: 'Geometría', difficulty: 1, prompt: '¿Cuántos lados tiene un pentágono?', options: ['4', '5', '6', '7'], answer: '5', hint: '"Penta" significa cinco.' },
          { id: 27, skill: 'Geometría', difficulty: 2, prompt: '¿Cuántas caras tiene un cubo?', options: ['4', '6', '8', '12'], answer: '6', hint: 'Piensa en un dado: arriba, abajo y los cuatro costados.' },
        ],
      },
      {
        id: 'perimetro-area', name: 'Perímetro y área', skill: 'Geometría',
        description: 'Medir el borde y la superficie.', grade: 4,
        questions: [
          { id: 3, skill: 'Geometría', difficulty: 2, prompt: 'Un cuadrado tiene lados de 5 cm. ¿Cuál es su perímetro?', options: ['10 cm', '15 cm', '20 cm', '25 cm'], answer: '20 cm', hint: 'Suma sus cuatro lados iguales.' },
          { id: 24, skill: 'Geometría', difficulty: 2, prompt: 'Un rectángulo mide 5 cm y 2 cm. ¿Cuál es su perímetro?', options: ['10 cm', '12 cm', '14 cm', '20 cm'], answer: '14 cm', hint: 'Suma los cuatro lados: 5 + 2 + 5 + 2.' },
          { id: 25, skill: 'Geometría', difficulty: 2, prompt: 'Un cuadrado tiene lado de 4 cm. ¿Cuál es su área?', options: ['8 cm²', '12 cm²', '16 cm²', '20 cm²'], answer: '16 cm²', hint: 'Área del cuadrado = lado × lado.' },
          { id: 15, skill: 'Geometría', difficulty: 3, prompt: 'Un rectángulo mide 6 cm por 3 cm. ¿Cuál es su área?', options: ['9 cm²', '18 cm²', '24 cm²', '36 cm²'], answer: '18 cm²', hint: 'Multiplica largo por ancho.' },
        ],
      },
    ],
  },
  {
    id: 'razonamiento-matematico', name: 'Razonamiento Matemático', area: 'Matemática', grade: GRADE,
    icon: '🧩', color: '#f59e0b', status: 'soon',
    description: 'Patrones y problemas con ingenio.',
    topics: [
      {
        id: 'patrones', name: 'Patrones', skill: 'Patrones',
        description: 'Descubre qué número sigue.', grade: 3,
        questions: [
          { id: 28, skill: 'Patrones', difficulty: 1, prompt: '¿Qué número sigue? 1, 3, 5, 7, …', options: ['8', '9', '10', '11'], answer: '9', hint: 'Van de 2 en 2.' },
          { id: 11, skill: 'Patrones', difficulty: 2, prompt: '¿Qué número sigue? 3, 6, 12, 24, …', options: ['30', '36', '48', '52'], answer: '48', hint: 'Cada número se multiplica por 2.' },
          { id: 29, skill: 'Patrones', difficulty: 2, prompt: '¿Qué número sigue? 5, 10, 20, 40, …', options: ['60', '70', '80', '45'], answer: '80', hint: 'Cada número es el doble del anterior.' },
          { id: 5, skill: 'Patrones', difficulty: 3, prompt: '¿Qué número sigue? 4, 8, 16, 32, …', options: ['36', '48', '56', '64'], answer: '64', hint: 'Cada número es el doble del anterior.' },
        ],
      },
      {
        id: 'problemas', name: 'Problemas', skill: 'Problemas',
        description: 'Situaciones de la vida real.', grade: 4,
        questions: [
          { id: 6, skill: 'Problemas', difficulty: 2, prompt: 'Lía tiene 3 bolsas con 7 canicas cada una. ¿Cuántas tiene en total?', options: ['10', '18', '21', '24'], answer: '21', hint: 'Multiplica el número de bolsas por las canicas de cada una.' },
          { id: 12, skill: 'Problemas', difficulty: 2, prompt: 'Hay 4 cajas con 6 lápices cada una. ¿Cuántos lápices hay?', options: ['10', '20', '24', '28'], answer: '24', hint: 'Multiplica cajas por lápices.' },
          { id: 30, skill: 'Problemas', difficulty: 2, prompt: 'Ana tiene 5 cajas con 4 stickers cada una. ¿Cuántos stickers tiene?', options: ['9', '16', '20', '24'], answer: '20', hint: 'Multiplica cajas por stickers.' },
          { id: 31, skill: 'Problemas', difficulty: 3, prompt: 'Un libro tiene 90 páginas. Si lees 30 por día, ¿en cuántos días lo terminas?', options: ['2', '3', '4', '6'], answer: '3', hint: 'Divide 90 entre 30.' },
        ],
      },
    ],
  },
  // ============================= HABILIDADES =============================
  {
    id: 'razonamiento-verbal', name: 'Razonamiento Verbal', area: 'Habilidades', grade: GRADE,
    icon: '💬', color: '#6c63ff', status: 'active',
    description: 'Sinónimos, antónimos, analogías y series.',
    topics: [
      {
        id: 'sinonimos', name: 'Sinónimos', skill: 'Sinónimos',
        description: 'Palabras que significan casi lo mismo.', grade: 3,
        theory: {
          intro: 'Los sinónimos son palabras distintas que significan casi lo mismo.',
          blocks: [
            { heading: '¿Qué son?', text: '"Bonito" y "lindo" son sinónimos: puedes cambiar una por la otra y la frase significa lo mismo.' },
            { heading: '¿Para qué sirven?', text: 'Nos ayudan a no repetir palabras y a escribir mejor.' },
          ],
          example: { problem: '¿Cuál es un sinónimo de "contento"?', solution: '"Feliz". Contento y feliz significan casi lo mismo.' },
          keyIdea: 'Sinónimo = palabra diferente con significado parecido.',
        },
        questions: [
          { id: 60, skill: 'Sinónimos', difficulty: 1, prompt: 'Sinónimo de "casa":', options: ['hogar', 'perro', 'mesa', 'agua'], answer: 'hogar', hint: 'Un lugar donde vives.' },
          { id: 61, skill: 'Sinónimos', difficulty: 1, prompt: 'Sinónimo de "rápido":', options: ['lento', 'veloz', 'grande', 'frío'], answer: 'veloz', hint: 'Que va con prisa.' },
          { id: 62, skill: 'Sinónimos', difficulty: 2, prompt: 'Sinónimo de "alegre":', options: ['triste', 'feliz', 'cansado', 'enojado'], answer: 'feliz', hint: 'Lo contrario de triste.' },
        ],
      },
      {
        id: 'antonimos', name: 'Antónimos', skill: 'Antónimos',
        description: 'Palabras que significan lo contrario.', grade: 4,
        theory: {
          intro: 'Los antónimos son palabras que significan lo contrario.',
          blocks: [
            { heading: '¿Qué son?', text: '"Alto" y "bajo" son antónimos: significan cosas opuestas.' },
            { heading: 'Una pista', text: 'Muchos antónimos se forman con "in-" o "des-": feliz → infeliz; ordenar → desordenar.' },
          ],
          example: { problem: '¿Cuál es el antónimo de "día"?', solution: '"Noche". Día y noche son opuestos.' },
          keyIdea: 'Antónimo = palabra con significado contrario.',
        },
        questions: [
          { id: 63, skill: 'Antónimos', difficulty: 1, prompt: 'Antónimo de "grande":', options: ['enorme', 'pequeño', 'ancho', 'largo'], answer: 'pequeño', hint: 'Lo opuesto de grande.' },
          { id: 64, skill: 'Antónimos', difficulty: 1, prompt: 'Antónimo de "caliente":', options: ['tibio', 'frío', 'rojo', 'suave'], answer: 'frío', hint: 'Lo opuesto de caliente.' },
          { id: 65, skill: 'Antónimos', difficulty: 2, prompt: 'Antónimo de "subir":', options: ['saltar', 'bajar', 'correr', 'caer'], answer: 'bajar', hint: 'Lo opuesto de subir.' },
        ],
      },
      {
        id: 'analogias', name: 'Analogías', skill: 'Analogías',
        description: 'Pares de palabras con la misma relación.', grade: 4,
        theory: {
          intro: 'Una analogía compara dos pares de palabras que se relacionan de la misma forma.',
          blocks: [
            { heading: 'Cómo funciona', text: 'PERRO es a LADRAR como GATO es a MAULLAR: cada animal con su sonido.' },
            { heading: 'El truco', text: 'Primero descubre la relación del primer par; luego búscala en el segundo.' },
          ],
          example: { problem: 'MANO es a GUANTE como PIE es a…', solution: 'ZAPATO. El guante cubre la mano; el zapato cubre el pie.' },
          keyIdea: 'En una analogía, los dos pares tienen la misma relación.',
        },
        questions: [
          { id: 66, skill: 'Analogías', difficulty: 2, prompt: 'PÁJARO es a VOLAR como PEZ es a…', options: ['correr', 'nadar', 'saltar', 'caminar'], answer: 'nadar', hint: '¿Cómo se mueve cada uno?' },
          { id: 67, skill: 'Analogías', difficulty: 2, prompt: 'LÁPIZ es a ESCRIBIR como TIJERA es a…', options: ['pintar', 'cortar', 'pegar', 'borrar'], answer: 'cortar', hint: '¿Para qué sirve cada uno?' },
          { id: 68, skill: 'Analogías', difficulty: 3, prompt: 'MÉDICO es a HOSPITAL como MAESTRO es a…', options: ['casa', 'escuela', 'parque', 'tienda'], answer: 'escuela', hint: '¿Dónde trabaja cada uno?' },
        ],
      },
      {
        id: 'series-verbales', name: 'Series y agrupaciones', skill: 'Series verbales',
        description: 'Continuar secuencias y agrupar palabras.', grade: 5,
        theory: {
          intro: 'En las series verbales ordenamos palabras por una regla; también agrupamos las que son de la misma familia.',
          blocks: [
            { heading: 'Busca la regla', text: 'Lunes, martes, miércoles… la regla son los días de la semana; sigue "jueves".' },
            { heading: 'El intruso', text: 'A veces hay que hallar la palabra que NO pertenece al grupo.' },
          ],
          example: { problem: '¿Qué sigue? Enero, febrero, marzo, …', solution: 'Abril. Son los meses del año en orden.' },
          keyIdea: 'Descubre la regla que une las palabras: para continuarla o para hallar la que sobra.',
        },
        questions: [
          { id: 69, skill: 'Series verbales', difficulty: 1, prompt: '¿Qué sigue? Uno, dos, tres, …', options: ['cinco', 'cuatro', 'seis', 'diez'], answer: 'cuatro', hint: 'Son los números en orden.' },
          { id: 70, skill: 'Series verbales', difficulty: 2, prompt: 'Señala la palabra que NO pertenece al grupo:', options: ['rojo', 'azul', 'verde', 'silla'], answer: 'silla', hint: 'Tres son colores.' },
          { id: 71, skill: 'Series verbales', difficulty: 2, prompt: '¿Qué sigue? Primavera, verano, otoño, …', options: ['lluvia', 'invierno', 'sol', 'frío'], answer: 'invierno', hint: 'Son las estaciones del año.' },
        ],
      },
    ],
  },
  // ============================= COMUNICACIÓN =============================
  {
    id: 'lenguaje', name: 'Lenguaje', area: 'Comunicación', grade: GRADE,
    icon: '📝', color: '#0ea5e9', status: 'active',
    description: 'Sílabas, clases de palabras y ortografía.',
    topics: [
      {
        id: 'silaba', name: 'La sílaba', skill: 'Sílabas',
        description: 'Los golpes de voz de las palabras.', grade: 3,
        theory: {
          intro: 'Las palabras se dividen en sílabas: los golpes de voz que damos al pronunciarlas.',
          blocks: [
            { heading: 'Contar sílabas', text: '"ca-sa" tiene 2 sílabas; "pe-lo-ta" tiene 3. Da una palmada por cada golpe de voz.' },
            { heading: 'La vocal manda', text: 'Cada sílaba tiene al menos una vocal (a, e, i, o, u).' },
          ],
          example: { problem: '¿Cuántas sílabas tiene "mariposa"?', solution: 'ma-ri-po-sa = 4 sílabas.' },
          keyIdea: 'Sílaba = un golpe de voz. Cada una lleva una vocal.',
        },
        questions: [
          { id: 80, skill: 'Sílabas', difficulty: 1, prompt: '¿Cuántas sílabas tiene "gato"?', options: ['1', '2', '3', '4'], answer: '2', hint: 'ga-to.' },
          { id: 81, skill: 'Sílabas', difficulty: 1, prompt: '¿Cuántas sílabas tiene "pelota"?', options: ['2', '3', '4', '5'], answer: '3', hint: 'pe-lo-ta.' },
          { id: 82, skill: 'Sílabas', difficulty: 2, prompt: '¿Cuántas sílabas tiene "computadora"?', options: ['3', '4', '5', '6'], answer: '5', hint: 'com-pu-ta-do-ra.' },
        ],
      },
      {
        id: 'sustantivo', name: 'El sustantivo', skill: 'Sustantivo',
        description: 'La palabra que nombra las cosas.', grade: 3,
        theory: {
          intro: 'El sustantivo es la palabra que nombra personas, animales, cosas o lugares.',
          blocks: [
            { heading: '¿Qué nombra?', text: '"niño", "perro", "mesa" y "Perú" son sustantivos: nombran algo.' },
            { heading: 'Comunes y propios', text: 'Común: ciudad. Propio: Lima (va con mayúscula).' },
          ],
          example: { problem: 'En "El gato duerme", ¿cuál es el sustantivo?', solution: '"gato": nombra al animal.' },
          keyIdea: 'Sustantivo = palabra que nombra personas, animales, cosas o lugares.',
        },
        questions: [
          { id: 83, skill: 'Sustantivo', difficulty: 1, prompt: '¿Cuál de estas palabras es un sustantivo?', options: ['correr', 'mesa', 'rápido', 'muy'], answer: 'mesa', hint: 'Nombra una cosa.' },
          { id: 84, skill: 'Sustantivo', difficulty: 2, prompt: '¿Cuál es un nombre propio?', options: ['ciudad', 'Lima', 'casa', 'montaña'], answer: 'Lima', hint: 'Los nombres propios van con mayúscula.' },
          { id: 85, skill: 'Sustantivo', difficulty: 1, prompt: 'En "La niña canta", el sustantivo es:', options: ['La', 'niña', 'canta', 'muy'], answer: 'niña', hint: 'Nombra a la persona.' },
        ],
      },
      {
        id: 'verbo', name: 'El verbo', skill: 'Verbo',
        description: 'La palabra que expresa acción.', grade: 4,
        theory: {
          intro: 'El verbo es la palabra que expresa una acción: lo que alguien hace.',
          blocks: [
            { heading: 'La acción', text: '"correr", "comer", "saltar" son verbos: dicen qué se hace.' },
            { heading: 'El tiempo', text: 'El verbo cambia: ayer "comí", hoy "como", mañana "comeré".' },
          ],
          example: { problem: 'En "Ana juega fútbol", ¿cuál es el verbo?', solution: '"juega": es la acción que hace Ana.' },
          keyIdea: 'Verbo = palabra que expresa una acción.',
        },
        questions: [
          { id: 86, skill: 'Verbo', difficulty: 1, prompt: '¿Cuál de estas palabras es un verbo?', options: ['bonito', 'saltar', 'mesa', 'azul'], answer: 'saltar', hint: 'Es una acción.' },
          { id: 87, skill: 'Verbo', difficulty: 1, prompt: 'En "El perro corre", el verbo es:', options: ['El', 'perro', 'corre', 'rápido'], answer: 'corre', hint: 'Es lo que hace el perro.' },
          { id: 88, skill: 'Verbo', difficulty: 2, prompt: '¿Cuál frase está en pasado?', options: ['Yo como', 'Yo comí', 'Yo comeré', 'Yo comería mañana'], answer: 'Yo comí', hint: 'Pasado = ya ocurrió.' },
        ],
      },
      {
        id: 'tilde', name: 'La tilde', skill: 'Ortografía',
        description: 'La rayita de la sílaba fuerte.', grade: 5,
        theory: {
          intro: 'La tilde (´) es la rayita que ponemos sobre algunas vocales para marcar la sílaba más fuerte.',
          blocks: [
            { heading: 'Sílaba fuerte', text: 'En "árbol", la fuerza va en "ár"; por eso lleva tilde.' },
            { heading: 'Ojo', text: 'No todas las palabras llevan tilde; solo cuando la regla lo pide.' },
          ],
          example: { problem: '¿Cuál palabra lleva tilde?', solution: '"lápiz" la lleva; la fuerza va en "lá".' },
          keyIdea: 'La tilde marca con una rayita la vocal de la sílaba más fuerte.',
        },
        questions: [
          { id: 89, skill: 'Ortografía', difficulty: 1, prompt: '¿Cuál palabra está bien escrita?', options: ['arbol', 'árbol', 'arból', 'árból'], answer: 'árbol', hint: 'La fuerza va en "ár".' },
          { id: 90, skill: 'Ortografía', difficulty: 2, prompt: '¿Cuál de estas palabras lleva tilde?', options: ['mesa', 'camion', 'camión', 'silla'], answer: 'camión', hint: 'La fuerza va en "ón".' },
          { id: 91, skill: 'Ortografía', difficulty: 2, prompt: 'La tilde sirve para…', options: ['separar sílabas', 'marcar la sílaba fuerte', 'hacer el plural', 'unir palabras'], answer: 'marcar la sílaba fuerte', hint: 'Es la rayita sobre la vocal.' },
        ],
      },
    ],
  },
  // ============================= CIENCIAS SOCIALES =============================
  {
    id: 'historia', name: 'Historia del Perú', area: 'Ciencias Sociales', grade: GRADE,
    icon: '🏛️', color: '#b45309', status: 'active',
    description: 'De los primeros pobladores a la independencia.',
    topics: [
      {
        id: 'primeros-pobladores', name: 'Primeros pobladores', skill: 'Historia',
        description: 'Cazadores, recolectores y Caral.', grade: 3,
        theory: {
          intro: 'Hace miles de años llegaron los primeros pobladores al Perú. Eran cazadores y recolectores.',
          blocks: [
            { heading: '¿Cómo vivían?', text: 'Cazaban animales y recolectaban frutos. Se movían de un lugar a otro buscando comida.' },
            { heading: 'Caral', text: 'Caral es la ciudad más antigua de América, construida en el Perú hace unos 5000 años.' },
          ],
          example: { problem: '¿Cuál es la ciudad más antigua de América?', solution: 'Caral, en el Perú.' },
          keyIdea: 'Los primeros peruanos fueron cazadores y recolectores; Caral es la ciudad más antigua de América.',
        },
        questions: [
          { id: 100, skill: 'Historia', difficulty: 1, prompt: '¿Cómo conseguían comida los primeros pobladores?', options: ['comprándola', 'cazando y recolectando', 'en el mercado', 'sembrando arroz'], answer: 'cazando y recolectando', hint: 'Aún no existían las tiendas.' },
          { id: 101, skill: 'Historia', difficulty: 2, prompt: '¿Cuál es la ciudad más antigua de América?', options: ['Cusco', 'Caral', 'Lima', 'Machu Picchu'], answer: 'Caral', hint: 'Está en el Perú y tiene unos 5000 años.' },
          { id: 102, skill: 'Historia', difficulty: 1, prompt: 'Caral se construyó en…', options: ['Chile', 'el Perú', 'México', 'España'], answer: 'el Perú', hint: 'Es orgullo peruano.' },
        ],
      },
      {
        id: 'los-incas', name: 'Los Incas', skill: 'Historia',
        description: 'El Tahuantinsuyo y su capital.', grade: 4,
        theory: {
          intro: 'Los Incas formaron el Tahuantinsuyo, el imperio más grande de América del Sur.',
          blocks: [
            { heading: 'La capital', text: 'Su capital fue el Cusco. El gobernante se llamaba Inca o Sapa Inca.' },
            { heading: 'Sus logros', text: 'Construyeron caminos, andenes para cultivar y ciudades como Machu Picchu.' },
          ],
          example: { problem: '¿Cuál fue la capital del imperio inca?', solution: 'El Cusco.' },
          keyIdea: 'Los Incas tuvieron su capital en el Cusco y formaron el Tahuantinsuyo.',
        },
        questions: [
          { id: 103, skill: 'Historia', difficulty: 1, prompt: '¿Cuál fue la capital de los Incas?', options: ['Lima', 'Cusco', 'Trujillo', 'Arequipa'], answer: 'Cusco', hint: 'Está en la sierra sur.' },
          { id: 104, skill: 'Historia', difficulty: 2, prompt: 'El imperio de los Incas se llamó:', options: ['Tahuantinsuyo', 'Virreinato', 'República', 'Chavín'], answer: 'Tahuantinsuyo', hint: 'Significa "las cuatro regiones".' },
          { id: 105, skill: 'Historia', difficulty: 2, prompt: 'Machu Picchu fue construida por los…', options: ['españoles', 'incas', 'chinos', 'mochicas'], answer: 'incas', hint: 'Está cerca del Cusco.' },
        ],
      },
      {
        id: 'independencia', name: 'La Independencia', skill: 'Historia',
        description: 'El Perú se libera de España.', grade: 5,
        theory: {
          intro: 'El Perú se independizó de España. Don José de San Martín proclamó la independencia en 1821.',
          blocks: [
            { heading: 'La proclamación', text: 'El 28 de julio de 1821, San Martín proclamó la independencia en Lima.' },
            { heading: 'Los libertadores', text: 'José de San Martín y Simón Bolívar ayudaron a liberar al Perú.' },
          ],
          example: { problem: '¿En qué año se proclamó la independencia del Perú?', solution: 'En 1821.' },
          keyIdea: 'El Perú proclamó su independencia el 28 de julio de 1821, con San Martín.',
        },
        questions: [
          { id: 106, skill: 'Historia', difficulty: 1, prompt: '¿Quién proclamó la independencia del Perú?', options: ['Simón Bolívar', 'José de San Martín', 'Francisco Pizarro', 'Túpac Amaru'], answer: 'José de San Martín', hint: 'Lo hizo en Lima, en 1821.' },
          { id: 107, skill: 'Historia', difficulty: 2, prompt: '¿En qué año se proclamó la independencia del Perú?', options: ['1532', '1780', '1821', '1879'], answer: '1821', hint: 'Fue un 28 de julio.' },
          { id: 108, skill: 'Historia', difficulty: 1, prompt: 'La independencia del Perú se celebra el…', options: ['28 de julio', '25 de diciembre', '1 de enero', '8 de octubre'], answer: '28 de julio', hint: 'Fiestas Patrias.' },
        ],
      },
    ],
  },
  // ============================= PERSONA, FAMILIA Y RR.HH. =============================
  {
    id: 'educacion-civica', name: 'Educación Cívica', area: 'Persona y Familia', grade: GRADE,
    icon: '⚖️', color: '#0d9488', status: 'active',
    description: 'Derechos, convivencia y símbolos patrios.',
    topics: [
      {
        id: 'derechos-nino', name: 'Derechos del niño', skill: 'Ciudadanía',
        description: 'Lo que todo niño debe recibir.', grade: 3,
        theory: {
          intro: 'Todos los niños y niñas tienen derechos: cosas que siempre deben recibir y que nadie puede quitar.',
          blocks: [
            { heading: 'Algunos ejemplos', text: 'Derecho a un nombre, a la educación, a la salud, a jugar y a ser cuidado.' },
            { heading: 'Para todos', text: 'Los derechos son para todos los niños por igual, sin importar de dónde vengan.' },
          ],
          example: { problem: '¿Ir a la escuela es un derecho del niño?', solution: 'Sí: el derecho a la educación.' },
          keyIdea: 'Todos los niños tienen derechos: nombre, educación, salud, jugar y ser protegidos.',
        },
        questions: [
          { id: 120, skill: 'Ciudadanía', difficulty: 1, prompt: '¿Cuál es un derecho de todo niño?', options: ['trabajar todo el día', 'ir a la escuela', 'pagar impuestos', 'conducir un auto'], answer: 'ir a la escuela', hint: 'Derecho a la educación.' },
          { id: 121, skill: 'Ciudadanía', difficulty: 1, prompt: 'El derecho a la salud significa que los niños…', options: ['no van al médico', 'pueden ser atendidos cuando enferman', 'no juegan', 'no estudian'], answer: 'pueden ser atendidos cuando enferman', hint: 'Cuidar la salud.' },
          { id: 122, skill: 'Ciudadanía', difficulty: 2, prompt: 'Los derechos del niño son para…', options: ['solo algunos niños', 'todos los niños por igual', 'solo los adultos', 'nadie'], answer: 'todos los niños por igual', hint: 'Sin distinción.' },
        ],
      },
      {
        id: 'convivencia', name: 'Normas de convivencia', skill: 'Ciudadanía',
        description: 'Acuerdos para convivir bien.', grade: 4,
        theory: {
          intro: 'Las normas son acuerdos que nos ayudan a convivir bien y a respetarnos.',
          blocks: [
            { heading: '¿Para qué sirven?', text: 'Para que todos estemos seguros y a gusto: por ejemplo, levantar la mano para hablar.' },
            { heading: 'Respeto', text: 'Cumplir las normas es respetar a los demás y a uno mismo.' },
          ],
          example: { problem: 'En el aula, ¿por qué levantamos la mano para hablar?', solution: 'Es una norma para escucharnos y respetar los turnos.' },
          keyIdea: 'Las normas son acuerdos para convivir bien y respetarnos.',
        },
        questions: [
          { id: 123, skill: 'Ciudadanía', difficulty: 1, prompt: '¿Para qué sirven las normas de convivencia?', options: ['para pelear', 'para convivir mejor', 'para gastar dinero', 'para nada'], answer: 'para convivir mejor', hint: 'Nos ayudan a estar bien juntos.' },
          { id: 124, skill: 'Ciudadanía', difficulty: 1, prompt: '¿Cuál es una buena norma en el aula?', options: ['gritar', 'respetar los turnos para hablar', 'empujar', 'no escuchar'], answer: 'respetar los turnos para hablar', hint: 'Escuchar a los demás.' },
          { id: 125, skill: 'Ciudadanía', difficulty: 2, prompt: 'Cumplir las normas es una forma de…', options: ['molestar', 'respetar a los demás', 'perder el tiempo', 'ganar dinero'], answer: 'respetar a los demás', hint: 'Convivencia sana.' },
        ],
      },
      {
        id: 'simbolos-patrios', name: 'Símbolos patrios', skill: 'Ciudadanía',
        description: 'Bandera, escudo e himno del Perú.', grade: 5,
        theory: {
          intro: 'Los símbolos patrios representan a nuestro país. En el Perú son la bandera, el escudo y el himno nacional.',
          blocks: [
            { heading: 'La bandera', text: 'La bandera del Perú es roja, blanca y roja. Representa al país.' },
            { heading: 'Otros símbolos', text: 'El escudo nacional y el Himno Nacional también nos representan.' },
          ],
          example: { problem: '¿De qué colores es la bandera del Perú?', solution: 'Roja, blanca y roja.' },
          keyIdea: 'Los símbolos patrios del Perú son la bandera, el escudo y el himno nacional.',
        },
        questions: [
          { id: 126, skill: 'Ciudadanía', difficulty: 1, prompt: '¿Cuáles son los colores de la bandera del Perú?', options: ['rojo y blanco', 'verde y rojo', 'azul y blanco', 'amarillo y rojo'], answer: 'rojo y blanco', hint: 'Roja, blanca y roja.' },
          { id: 127, skill: 'Ciudadanía', difficulty: 1, prompt: '¿Cuál es un símbolo patrio del Perú?', options: ['el escudo nacional', 'un carro', 'una pelota', 'un árbol'], answer: 'el escudo nacional', hint: 'Representa al país.' },
          { id: 128, skill: 'Ciudadanía', difficulty: 2, prompt: 'El Himno Nacional es un símbolo que se…', options: ['dibuja', 'canta', 'come', 'maneja'], answer: 'canta', hint: 'Tiene letra y música.' },
        ],
      },
    ],
  },
  // ============================= CIENCIAS NATURALES =============================
  {
    id: 'biologia', name: 'Biología', area: 'Ciencias Naturales', grade: GRADE,
    icon: '🧬', color: '#16a34a', status: 'active',
    description: 'Seres vivos, plantas y el cuerpo humano.',
    topics: [
      {
        id: 'seres-vivos', name: 'Seres vivos', skill: 'Seres vivos',
        description: 'Qué tienen de especial los seres vivos.', grade: 3,
        theory: {
          intro: 'Los seres vivos nacen, crecen, se alimentan, se reproducen y mueren. Las cosas sin vida no hacen eso.',
          blocks: [
            { heading: '¿Quiénes son?', text: 'Personas, animales y plantas son seres vivos. Una piedra o una silla no lo son.' },
            { heading: 'Lo que necesitan', text: 'Todos los seres vivos necesitan alimento y agua para vivir.' },
          ],
          example: { problem: '¿Un árbol es un ser vivo?', solution: 'Sí: nace, crece, se alimenta y se reproduce.' },
          keyIdea: 'Los seres vivos nacen, crecen, se alimentan, se reproducen y mueren.',
        },
        questions: [
          { id: 140, skill: 'Seres vivos', difficulty: 1, prompt: '¿Cuál es un ser vivo?', options: ['una roca', 'un árbol', 'una silla', 'un carro'], answer: 'un árbol', hint: 'Nace, crece y se reproduce.' },
          { id: 141, skill: 'Seres vivos', difficulty: 1, prompt: '¿Cuál NO es un ser vivo?', options: ['perro', 'flor', 'piedra', 'niño'], answer: 'piedra', hint: 'No nace ni crece.' },
          { id: 142, skill: 'Seres vivos', difficulty: 2, prompt: 'Todos los seres vivos necesitan… para vivir', options: ['dinero', 'alimento y agua', 'televisión', 'juguetes'], answer: 'alimento y agua', hint: 'Lo básico para la vida.' },
        ],
      },
      {
        id: 'las-plantas', name: 'Las plantas', skill: 'Plantas',
        description: 'Sus partes y cómo se alimentan.', grade: 3,
        theory: {
          intro: 'Las plantas son seres vivos que fabrican su propio alimento con la luz del sol.',
          blocks: [
            { heading: 'Sus partes', text: 'La raíz, el tallo, las hojas, la flor y el fruto.' },
            { heading: 'La raíz', text: 'La raíz sujeta la planta y absorbe el agua del suelo.' },
          ],
          example: { problem: '¿Qué parte de la planta absorbe el agua del suelo?', solution: 'La raíz.' },
          keyIdea: 'Las plantas tienen raíz, tallo, hojas, flor y fruto, y fabrican su alimento con el sol.',
        },
        questions: [
          { id: 143, skill: 'Plantas', difficulty: 1, prompt: '¿Qué parte de la planta absorbe agua del suelo?', options: ['la flor', 'la raíz', 'la hoja', 'el fruto'], answer: 'la raíz', hint: 'Está bajo tierra.' },
          { id: 144, skill: 'Plantas', difficulty: 2, prompt: 'Las plantas fabrican su alimento gracias a…', options: ['la luna', 'la luz del sol', 'el viento', 'la oscuridad'], answer: 'la luz del sol', hint: 'Se llama fotosíntesis.' },
          { id: 145, skill: 'Plantas', difficulty: 1, prompt: '¿Cuál es una parte de la planta?', options: ['el tallo', 'la pata', 'el ala', 'la aleta'], answer: 'el tallo', hint: 'Sostiene las hojas y flores.' },
        ],
      },
      {
        id: 'cuerpo-humano', name: 'El cuerpo humano', skill: 'Cuerpo humano',
        description: 'Órganos y para qué sirven.', grade: 4,
        theory: {
          intro: 'Nuestro cuerpo tiene órganos y sistemas que trabajan juntos para mantenernos vivos y sanos.',
          blocks: [
            { heading: 'Algunos órganos', text: 'El corazón bombea sangre, los pulmones nos dan aire y el estómago digiere la comida.' },
            { heading: 'Los huesos', text: 'El esqueleto sostiene el cuerpo y protege los órganos.' },
          ],
          example: { problem: '¿Qué órgano bombea la sangre?', solution: 'El corazón.' },
          keyIdea: 'El corazón bombea sangre, los pulmones dan aire y los huesos sostienen el cuerpo.',
        },
        questions: [
          { id: 146, skill: 'Cuerpo humano', difficulty: 1, prompt: '¿Qué órgano bombea la sangre?', options: ['el pulmón', 'el corazón', 'el estómago', 'el cerebro'], answer: 'el corazón', hint: 'Late en tu pecho.' },
          { id: 147, skill: 'Cuerpo humano', difficulty: 1, prompt: '¿Con qué órgano respiramos?', options: ['los pulmones', 'el hígado', 'los riñones', 'la piel'], answer: 'los pulmones', hint: 'Se llenan de aire.' },
          { id: 148, skill: 'Cuerpo humano', difficulty: 2, prompt: 'El esqueleto sirve para…', options: ['digerir la comida', 'sostener el cuerpo', 'pensar', 'ver los colores'], answer: 'sostener el cuerpo', hint: 'Son los huesos.' },
        ],
      },
      {
        id: 'los-sentidos', name: 'Los sentidos', skill: 'Cuerpo humano',
        description: 'Cómo conocemos el mundo.', grade: 5,
        theory: {
          intro: 'Tenemos cinco sentidos que nos conectan con el mundo: vista, oído, olfato, gusto y tacto.',
          blocks: [
            { heading: 'Cada sentido', text: 'Vemos con los ojos, oímos con los oídos, olemos con la nariz, saboreamos con la lengua y tocamos con la piel.' },
            { heading: '¿Para qué?', text: 'Nos ayudan a conocer el entorno y a cuidarnos.' },
          ],
          example: { problem: '¿Con qué órgano saboreamos la comida?', solution: 'Con la lengua (sentido del gusto).' },
          keyIdea: 'Los cinco sentidos son vista, oído, olfato, gusto y tacto.',
        },
        questions: [
          { id: 149, skill: 'Cuerpo humano', difficulty: 1, prompt: '¿Con qué órgano olemos?', options: ['los ojos', 'la nariz', 'las manos', 'los oídos'], answer: 'la nariz', hint: 'Sentido del olfato.' },
          { id: 150, skill: 'Cuerpo humano', difficulty: 1, prompt: '¿Cuántos sentidos tenemos?', options: ['3', '4', '5', '6'], answer: '5', hint: 'Vista, oído, olfato, gusto y tacto.' },
          { id: 151, skill: 'Cuerpo humano', difficulty: 2, prompt: 'El sentido del tacto lo tenemos en…', options: ['la lengua', 'la piel', 'los oídos', 'la nariz'], answer: 'la piel', hint: 'Cubre todo el cuerpo.' },
        ],
      },
    ],
  },
  // ============================= PRÓXIMAMENTE =============================
  {
    id: 'literatura', name: 'Literatura', area: 'Comunicación', grade: GRADE,
    icon: '📚', color: '#a855f7', status: 'soon',
    description: 'Cuentos, poesía y autores del Perú.',
    topics: [
      { id: 'generos', name: 'Géneros literarios', skill: 'Literatura', description: 'Narrativo, lírico y dramático.', grade: 3, questions: [] },
      { id: 'figuras', name: 'Figuras literarias', skill: 'Literatura', description: 'Comparación, metáfora y más.', grade: 4, questions: [] },
      { id: 'literatura-peruana', name: 'Literatura peruana', skill: 'Literatura', description: 'Autores y obras del Perú.', grade: 5, questions: [] },
    ],
  },
  {
    id: 'algebra', name: 'Álgebra', area: 'Matemática', grade: GRADE,
    icon: '✖️', color: '#ef4444', status: 'soon',
    description: 'Patrones, símbolos e incógnitas.',
    topics: [
      { id: 'patrones-simbolos', name: 'Patrones con símbolos', skill: 'Álgebra', description: 'Reglas con figuras y letras.', grade: 3, questions: [] },
      { id: 'incognita', name: 'La incógnita (la cajita)', skill: 'Álgebra', description: 'Hallar el número que falta.', grade: 4, questions: [] },
      { id: 'ecuaciones-simples', name: 'Ecuaciones simples', skill: 'Álgebra', description: 'Igualdades con un valor desconocido.', grade: 5, questions: [] },
    ],
  },
  {
    id: 'fisica', name: 'Física', area: 'Ciencias Naturales', grade: GRADE,
    icon: '⚛️', color: '#2563eb', status: 'soon',
    description: 'Fuerzas, movimiento y energía.',
    topics: [
      { id: 'fuerzas-movimiento', name: 'Fuerzas y movimiento', skill: 'Física', description: 'Empujar, jalar y moverse.', grade: 4, questions: [] },
      { id: 'energia', name: 'La energía', skill: 'Física', description: 'Luz, calor y electricidad.', grade: 5, questions: [] },
      { id: 'maquinas-simples', name: 'Máquinas simples', skill: 'Física', description: 'Palanca, rueda y plano inclinado.', grade: 5, questions: [] },
    ],
  },
  {
    id: 'geografia', name: 'Geografía', area: 'Ciencias Sociales', grade: GRADE,
    icon: '🗺️', color: '#ca8a04', status: 'soon',
    description: 'Las regiones y el relieve del Perú.',
    topics: [
      { id: 'regiones', name: 'Regiones del Perú', skill: 'Geografía', description: 'Costa, sierra y selva.', grade: 3, questions: [] },
      { id: 'relieve-clima', name: 'Relieve y clima', skill: 'Geografía', description: 'Montañas, ríos y climas.', grade: 4, questions: [] },
      { id: 'mapas', name: 'Mapas y ubicación', skill: 'Geografía', description: 'Leer mapas y puntos cardinales.', grade: 5, questions: [] },
    ],
  },
];

export const ACTIVE_COURSES: Course[] = CURRICULUM.filter((course) => course.status === 'active');

export function getCourseQuestions(course: Course): Question[] {
  return course.topics.flatMap((topic) => topic.questions);
}

export function getAllActiveQuestions(): Question[] {
  return ACTIVE_COURSES.flatMap(getCourseQuestions);
}

/**
 * Preguntas para la "misión rápida" del inicio (la torre): solo del área de
 * Matemática, para que la misión temática se mantenga coherente.
 */
export function getMissionQuestions(): Question[] {
  return ACTIVE_COURSES
    .filter((course) => course.area === 'Matemática')
    .flatMap(getCourseQuestions);
}

export function courseById(id: string): Course | undefined {
  return CURRICULUM.find((course) => course.id === id);
}
