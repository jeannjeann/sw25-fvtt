# Manual de Sword World 2.5
v0.10.2

## PJ

### Cabecera
Es la zona donde se muestra el resumen del personaje.
- Se pueden ajustar el nombre, la imagen del personaje, los PV actuales, los PM actuales, las Pifias y si tiene Gracia o no.
- El resto de campos se rellenan automáticamente desde otros campos de entrada.

### Pestañas
- En cada lista de elementos, haz clic en el nombre de cualquier elemento (excepto técnicas, tiradas de dados, recursos e idiomas) para desplegar su descripción.
- En los listados que no tienen botones de Nuevo, Editar o Borrar, esos botones aparecen al desplegar la descripción.

#### Pestaña Atributo y Clase
Estas pestañas se usan principalmente durante la creación y el crecimiento.
- Columna de valores de atributo (izquierda)
  - Los valores de atributo y los bonos se calculan automáticamente introduciendo Mente, Técnica, Cuerpo, A-F, Crecimiento y Modificaciones.
  - Haz clic en "Crecimiento" para hacer una Tirada de Crecimiento, y selecciona el resultado en el mensaje de chat para subir directamente el valor del atributo.
- Modificadores de PV y PM máximos (arriba a la derecha)
  - Se rellenan cuando quieras modificar los valores calculados automáticamente. Está pensado para casos en los que el valor cambia por habilidades especiales, objetos, magia, etc. (Se querría implementar el cálculo automático)
- Columna de Clase (abajo a la derecha)
  - Aquí se listan las Clases. Al hacer clic en el icono se muestra la descripción en el chat.
  - Desde la lista puedes subir, bajar, editar, borrar o crear niveles nuevos.
  - También puedes añadir Clases arrastrándolas desde un objeto.
  - La experiencia gastada se calcula automáticamente.
  - Consulta más abajo la descripción de los objetos para más detalle.

#### Pestaña Prueba
Son las pestañas que se usan principalmente durante la parte normal (fuera de combate) de la sesión.
- Columna de Pruebas (izquierda)
  - Se pueden registrar distintas Pruebas. Puedes hacer una prueba de acción y una tirada de poder.
  - Desde la lista puedes introducir, editar, borrar y crear valores nuevos.
  - El valor base mostrado es el que se suma a 2d6 en el caso de las pruebas, y el que se suma tras la tirada en el caso de las tiradas de poder. Las entradas de la columna de modificación se reflejan en este valor.
  - Haz clic en el nombre del elemento y en el valor base para hacer la tirada correspondiente.
  - Esta lista está pensada para ganar comodidad registrando pruebas básicas como Fortaleza y Voluntad, además de pruebas de uso frecuente relacionadas con técnicas como Iniciativa, Conocimiento de Monstruos, Paquete de Pruebas y Lanzamiento de Conjuros.
  - Fortaleza, Voluntad, Iniciativa y Conocimiento de Monstruos se crean durante la creación del personaje.
  - Iniciativa y Conocimiento de Monstruos deben configurarse con la Clase y el valor de atributo que se usen.
  - El nombre del elemento determina si le aplican los Efectos Activos.
  - Como puedes crear estos elementos libremente, úsalos con flexibilidad: por ejemplo, prepara la Iniciativa del Explorador y la del Táctico por separado.
  - Consulta más abajo las descripciones de los objetos para más detalle.
- Columna de pruebas de Clase genéricas (derecha)
  - Esta columna sirve para hacer cómodamente una prueba de "nivel de Clase XX + bono de XX" que combina las Clases que posees con cada bono de atributo.
  - Se muestra el valor base calculado automáticamente. Haz clic en el número para hacer la tirada correspondiente.
  - Puedes indicar un valor de modificación por cada técnica.

#### Pestaña Combate
Esta pestaña está pensada principalmente para usarse durante el combate.
- Columna de Pruebas (arriba a la izquierda)
  - De las Pruebas registradas en la pestaña Prueba, solo se muestran las que tienen marcado "Combate" en el detalle del objeto.
  - Es cómodo registrar aquí los roles que se usan a menudo en combate.
  - Desde esta columna no se puede crear, editar ni borrar. Hazlo desde la lista de la pestaña Prueba.
- Columna de información de combate (arriba a la derecha)
  - Se muestra la velocidad de movimiento. Se puede modificar. La modificación se aplica al movimiento normal.
  - El acierto y el poder reflejan los valores del arma seleccionada en la columna central para los distintos modificadores. Las columnas de modificadores se ven reflejadas.
  - La evasión es el valor de evasión según la técnica seleccionada en la columna de modificadores. Los modificadores se reflejan.
  - Haz clic para tirar acierto, poder y evasión.
  - Se muestran los valores de Protección (puntos de protección) y Protección mágica. Los valores de las columnas de modificadores se reflejan. El valor modificado de reducción de daño (reducción D) también se refleja; si se introduce reducción D, se muestra como "Valor total (valor original + valor de reducción D)".
- Columna de corrección (centro)
  - Permite introducir distintas modificaciones. Las modificaciones se reflejan en la columna "Información de combate".
  - El arma que se usa para acierto y poder se selecciona en la columna de Información de combate.
  - Selecciona el valor inicial que se usará para el acierto y el daño del arma en la Clase por defecto asignada al arma.
  - Selecciona la Clase que se usará para la evasión en la columna de Información de combate.
- Columna de equipo
  - Se muestran las armas, armaduras y accesorios que tengan marcada la casilla "Equipado" en el detalle del objeto.
  - Desde esta columna no puedes crear, editar ni borrar objetos. Hazlo desde la lista de la pestaña "Objetos".
  - El comportamiento al hacer clic en el icono se configura en el detalle. La opción por defecto es "Todo", que muestra en el chat la descripción y los botones "Tirada", "Poder" y "Efecto" (si aplica).
  - Haz clic para tirar las secciones de acierto y poder de la lista de armas. Los valores de los campos de modificadores se reflejan.
  - Al usar un arma secundaria o al usar un arma de forma distinta (por ejemplo, a dos manos con un arma ambidiestra), este clic directo puede ser más cómodo que cambiar el arma seleccionada.

#### Pestaña Dotes
Esta pestaña muestra las habilidades raciales y las dotes de combate, además de Técnicas, Cantos de conjuro y Finales, Acrobacias de montura, Evocaciones alquímicas, Aspectos, Estratagemas de combate y Maniobras, etc.
- Se puede crear, editar y borrar.
- Si no posees ninguna de las Clases listadas, no se mostrarán, salvo la raza y las dotes de combate. Si marcas la casilla "Mostrar grupos vacíos", también se mostrará la lista de elementos que no posees. Usa esta opción si quieres crear un elemento nuevo.
- El comportamiento al hacer clic en los iconos se configura desde el Detalle. La opción por defecto es "Todo", que muestra en el chat la descripción y los botones "Tirada", "Poder" y "Efecto" (si aplica). (Las Técnicas tienen además el campo de Coste de PM)
- Algunos elementos se pueden marcar en "Usar tirada de dados" y "Usar tabla de poder" en el detalle. Al marcarlos, aparecen "Tirada de dados" y "Poder" en la lista, y se puede hacer la tirada correspondiente haciendo clic en la casilla. Usa esta función cuando la necesites, por ejemplo para pruebas de uso de cantos de conjuro, o para tiradas de poder.
- Si has configurado "Efectos" en el detalle del objeto, aparecerá "Efectos" junto al elemento en tu hoja de personaje.
- Los tipos de acción se muestran automáticamente delante del nombre. Se muestran los siguientes tipos: Siempre (○), Mayor (▶), Menor (≫), Preparación de combate (△) y Declaración (□).
- En la lista de Técnicas, el Coste de PM se puede aplicar seleccionando el personaje y haciendo clic en "Coste de PM" en la hoja de personaje.

#### Pestaña Conjuros
Esta pestaña muestra la información sobre magia.
- La lista se divide por cada sistema de magia. El sistema de magia que selecciones en el detalle del objeto se refleja en la lista.
- El sistema de magia y el poder mágico se muestran en la parte superior de la lista. Al hacer clic en el elemento puedes determinar si se usa o no. Para hacer la tirada en el chat necesitas seleccionar la Clase que se va a usar. También hay una casilla de entrada para modificaciones.
- Para editar o borrar conjuros, tienes que desplegar la descripción o ir a la lista "Mostrar todos los conjuros".
- Para crear un conjuro nuevo, usa el menú principal o ve a la lista "Mostrar todos los conjuros" y pulsa el botón Nuevo.
- El comportamiento al hacer clic en los iconos se configura en el detalle. La opción por defecto es "Todo", que muestra la descripción, activa los botones de tirada, aplica los Efectos Activos y muestra el botón de Coste de PM en el chat.
- Algunos elementos se pueden marcar en "Usar dados" y "Usar tabla de poder" en el detalle. Al marcarlos, aparecen "Prueba de dados" y "Poder" en la lista, y se puede hacer la tirada correspondiente haciendo clic. Como las tiradas se pueden lanzar desde la parte superior de la lista, usa sobre todo las tiradas de poder cuando haga falta.
  - Algunos conjuros con cálculos de daño especiales se pueden gestionar editando los números de la tabla de poder. En esos casos, ajusta manualmente, ya que un doble 1 dará 0.
- Si hay Efectos configurados en el Detalle, aparecerán en la lista y se podrán aplicar al personaje.
- Si hay un personaje seleccionado, el Coste de PM se puede aplicar haciendo clic en el botón "Coste de PM".
- Si marcas la casilla "Mostrar todos los conjuros", se mostrará la lista de todos los conjuros que posees, sin importar el sistema. También puedes hacer clic en los iconos y tirar desde "Lanzamiento de conjuros" y "Poder".
- La creación, edición y borrado solo se pueden hacer desde la lista "Mostrar todos los conjuros".
- El tipo de acción mágica se muestra automáticamente delante del nombre. Se muestran los siguientes tipos: Siempre (○), Mayor (▶), Menor (≫), Preparación de combate (△) y Declaración (□).

#### Pestaña Efectos
Esta pestaña muestra la información sobre los efectos que hay sobre el personaje, como potenciadores y penalizadores.
- Resumen de Efectos (arriba)
  - Muestra el valor total modificado de los efectos aplicados actualmente.
  - Los efectos se aplican automáticamente a las tiradas y otras acciones.
  - El total se recalcula automáticamente cada vez que activas o desactivas un efecto.
- Lista de efectos (abajo)
  - Lista los efectos temporales, permanentes y desactivados.
  - Puedes crear, editar y borrar los efectos, además de activarlos y desactivarlos.
  - La fuente de referencia se muestra como el nombre del objeto para los potenciadores derivados de objetos, y como el nombre del personaje para los creados en la hoja de personaje.
  - Si un efecto temporal tiene duración configurada, el tiempo solo se muestra durante el combate.
- **¡Atención!** Los efectos de Ataques especiales y Rayo crítico solo se aplican al arma seleccionada.
- **¡Atención!** Algunas claves de atributo de los Efectos Activos no se actualizan tras cargar el Mundo, pero se actualizan solas en cuanto hagas cualquier ajuste en la Hoja de personaje.
  - Ejemplos de ajuste: activar/desactivar la Gracia, introducir modificadores, actualizar los PV actuales, activar/desactivar Efectos Activos, etc.

#### Pestaña Objetos
Esta pestaña muestra los objetos que posees, incluido el equipo.
- Hay un campo para introducir el dinero que llevas. No hay cálculo automático. (Pendiente de implementar)
- Se puede crear, editar y borrar cada objeto. Las armas, armaduras y accesorios se crean aquí. No se puede hacer desde la pestaña de combate.
- Lista de objetos
  - Marcando las casillas "Usar tirada de dados" y "Usar tabla de poder" en el detalle, aparecen "Prueba de dados" y "Poder" en la lista, y puedes hacer la tirada correspondiente haciendo clic. Usa esta función para hierbas medicinales y similares.
  - Si has configurado "Efectos" en el Detalle del objeto, aparecerá "Efectos" en la lista junto al objeto y podrás aplicarlos a tu personaje.
  - El comportamiento al hacer clic en el icono se configura en el menú "Detalle". La opción por defecto es "Todo", que muestra en el chat la descripción y los botones "Tirada", "Poder" y "Efecto" (si aplica).
- Armas, Armaduras y Accesorios
  - Hay una casilla "Equipar" en la lista. Los objetos marcados se muestran en la pestaña de combate.
  - (Las armas, armaduras y accesorios no muestran "Prueba de dados" ni "Poder" aunque tengan marcadas "Usar tirada de dados" y "Usar tabla de poder" en el detalle.)
  - Si has configurado "Efectos" en el Detalle del equipo, aparecerá "Efectos" en la lista junto al equipo y podrás aplicarlos a tu personaje.
  - El comportamiento al hacer clic en los iconos se configura en el detalle. La opción por defecto es "Todo", que muestra en el chat la descripción y los botones "Tirada", "Poder" y "Efecto" (si aplica).

#### Pestaña Descripción
Esta pestaña muestra idiomas, otros ajustes, notas, etc.
- Columna de Idiomas (arriba a la izquierda)
  - Los idiomas se pueden crear, editar y borrar.
  - Puedes marcar las casillas de "Conversación" y "Lectura".
- Ajustes (arriba a la derecha)
  - Aquí se introducen los datos.
  - Puedes configurar los valores iniciales de Clase para ciertos elementos.
- Columna de apariencia, trayectoria y otras notas (abajo)
  - Campo de descripción libre.

## PNJ
- Se pueden anotar los PV, PM, resumen, descripción y notas para el DJ.
- Con permisos limitados solo se muestra el resumen.
- Puedes configurar el nombre que se muestra con permisos limitados.
- Las notas para el DJ solo se muestran al DJ.

## Monstruo
Aquí se introducen los datos del monstruo.

### Cabecera
Es la zona donde se muestra el resumen del monstruo.
- Se pueden introducir el nombre, la imagen del monstruo, los PV actuales y los PM actuales.
- El resto de la información se rellena automáticamente desde los campos de las otras pestañas.
- Al hacer clic en "Botín" se envía al chat el mensaje de la tirada de botín.
- Con permisos limitados solo se muestra el resumen.
- Sobre la prueba de Conocimiento de Monstruos
  - Con permisos limitados solo se muestra el resumen.
  - Si tienes permisos limitados antes o después de superar la prueba de Conocimiento de Monstruos, los datos se mantienen ocultos.
  - Si al jugador se le conceden permisos de "Observador" tras superar la prueba de Conocimiento de Monstruos, los datos serán visibles para él.
  - La imagen se muestra tal cual al jugador con permisos limitados.

#### Pestaña Habilidades de monstruo
Esta pestaña muestra las distintas habilidades de los monstruos.
- Usa este elemento para Fortaleza y Voluntad. Se añade automáticamente al crear el monstruo, pero aun así hay que configurarlo a mano.
- El comportamiento al hacer clic en el icono se configura desde el Detalle. La opción por defecto es "Todo", que muestra en el chat la descripción y los botones "Tirada", "Poder" y "Efecto" (si aplica).
- El tipo de acción de la habilidad se muestra automáticamente delante de su nombre. Los tipos disponibles son: Siempre "○", Acción mayor "▶", Acción menor "≫", Preparación de combate "△" y Declaración "□".
- Marcando las casillas "Prueba 1-3" y "Tabla de poder" en el detalle, se muestran los nombres de etiqueta respectivos, y se puede hacer la tirada correspondiente haciendo clic. Úsalo según haga falta.
- Si has configurado "Efectos" en el Detalle de la habilidad, aparecerá "Efectos" en la lista junto a la habilidad y podrás aplicarlos al monstruo.
- Marcando la casilla "Valor fijo" en el Detalle de cada prueba, el resultado del dado se fija automáticamente en "7" y el resultado se muestra como valor fijo.
- Si has activado la Prueba y la Tirada de poder, también se mostrará la casilla de entrada del valor modificado.
- Usa este elemento también para las habilidades básicas (por ejemplo, ataques normales). Se añade automáticamente al crear el monstruo, pero aun así hay que configurarlo a mano.
  - Se usan tres pruebas: Acierto, Daño y Evasión. Hay que introducirlas a mano.
  - Los PV, PM, Protección (puntos de protección) y Protección mágica se introducen por separado.
- Las habilidades que permiten resistencia también deben usar este elemento.
  - Las tiradas de dados se pueden hacer marcando una de las Pruebas. Usa una etiqueta con "Lanzamiento de conjuros" o similar. También se pueden usar valores fijos.
  - La resistencia y sus resultados se pueden introducir en el campo de observaciones como "evita/anula" para mejorar la legibilidad.
- Los monstruos de varias partes no se pueden representar con un solo token. (Pendiente de implementar)
  - Prepara tokens separados para el token principal y para las demás partes del cuerpo, y manéjalos con varios tokens.
  - Para las habilidades que afectan a todo el cuerpo, usa la descripción de la columna de observaciones.
- **Sobre la magia**
  - La magia está pensada para registrarse como habilidad mágica.
  - La magia individual puede usar los mismos objetos que los PJ. También se puede expresar como habilidad mágica.
  - Si quieres usar los mismos objetos que los PJ, marca la casilla "Usar conjuros" para mostrar la lista de magia y usarla.
  - Introduce el poder mágico del monstruo en el modificador de la prueba y úsalo.
  - Ten en cuenta que no se pueden tirar dados para las técnicas ni los valores de atributo salvo que se seleccione "-".

#### Pestaña Efectos
Los efectos se listan igual que en la hoja de PJ, pero solo se muestran los válidos, como con los totales del Resumen de Efectos.
- Solo se aplicará el cambio de los Efectos Activos de monstruos que muestren un total. Las claves de atributo que no muestran totales se ignoran.
- Esto se puede usar para gestionar el tiempo transcurrido.
- **¡Atención!** Algunas claves de atributo de los Efectos Activos no se actualizan tras cargar el Mundo, pero se actualizan solas en cuanto hagas cualquier ajuste en la Hoja de personaje.
  - Ejemplos de ajuste: activar/desactivar la Gracia, introducir modificadores, actualizar los PV actuales, activar/desactivar Efectos Activos, etc.

#### Pestaña Descripción
- Es un campo de descripción libre. Está pensado para descripciones generales del monstruo.
- También se muestra la lista de botín descrita en la pestaña Detalles.

#### Pestaña Detalles
Pestaña para introducir distintos datos.
- Las notas para el DJ solo se muestran al DJ.
- Puedes configurar el nombre que se muestra con permisos limitados.

## Objetos varios
Cada objeto se puede configurar en detalle. Esto se hace principalmente desde la pestaña Detalles. Salvo algunas excepciones, ciertos elementos son comunes.

- Pestaña Descripción
  - Campo de descripción del objeto. Descripción libre. Según los ajustes, este campo se muestra en el chat al hacer clic en el icono.
- Al hacer clic en el icono
  - Puedes seleccionar el comportamiento al hacer clic en el icono de la lista. Puedes elegir mostrar en el chat la descripción, las tiradas de dados y/o el Coste de PM.
  - Al seleccionar "Todo", se muestran la descripción, el botón de tirada, la aplicación de efectos y, para algunos objetos, el botón de Coste de PM.
- Usar tirada de dados, Usar tabla de poder
  - Marcar la casilla habilita la tirada desde la lista. Además, al marcarla se muestran los elementos de configuración.
- Ajustes de uso de dados
  - Puedes indicar la Clase, los bonos de atributo y los modificadores que se usan en la tirada. También puedes marcar la casilla "Dados personalizados" para usar dados distintos de 2d6. También se pueden indicar valores fijos.
- Ajustes de la tabla de poder
  - Configura la Clase, el bono de atributo, el modificador, el poder, el valor crítico (valor C) y el contenido de la tabla de poder que se usa en la tirada.
  - Marca "Mitad" para reducir el resultado a la mitad.
  - La casilla "Tratamiento especial (Particular)" permite configurar el valor modificado después de partir por la mitad, el incremento del Golpe letal (normalmente 1), el incremento del Rayo crítico y la tirada de las Herramientas de boticario (normalmente 4).
  - Rayo crítico "f<x>" (sustituye X por cualquier número): hace que la primera tirada sea un número fijo igual a <x>. Esta función también sirve para el "Cambiar el destino" de los humanos.
  - El cálculo de la Hoja del verdugo no se puede gestionar por ahora. Consulta las apuestas y modifica los valores a mano.
  - Si la tabla de poder está en blanco, se consultará la tabla de poder genérica para obtener el valor. (Aún no implementado; una vez implementado, se podrá gestionar la Hoja del verdugo)
- Pestaña Efectos
  - Se pueden aplicar Efectos a los objetos.
  - Los Efectos de los objetos se aplican automáticamente al PJ que posee el objeto.

### Armas
- Se pueden configurar las casillas de equipo, categorías, rangos, tipos, usos, especializaciones, Fuerza mínima, modificadores de acierto, daño adicional y alcances.
- Son objetos que se usan tanto con la prueba como con la tabla de poder.
- Si has seleccionado una Clase de ataque en la pestaña Combate del personaje, la Clase seleccionada y el atributo por defecto se elegirán automáticamente cuando las Clases y atributos de prueba y poder estén sin seleccionar. Ten en cuenta que no quedan enlazados.
- Los bonos por especialización se actualizan automáticamente una vez configurados los Efectos Activos. La casilla solo cambia la visualización de la lista.
- Para armas con varios usos, conviene crear un objeto separado por cada uso.
- Las casillas de equipo y la activación/desactivación de los Efectos Activos están enlazadas, pero también se pueden cambiar a mano.

### Armaduras y Escudos
- Las armaduras y los escudos son objetos de la misma categoría.
- Se pueden configurar las casillas de equipo, categorías, rangos, especializaciones, Fuerza mínima, modificadores de evasión, puntos de protección y protección mágica.
- En estos objetos no se suelen usar ni la tirada de dados ni el poder.
- El bono de los Objetos personales se refleja automáticamente si hay un Efecto configurado. La casilla de Objetos personales solo cambia la visualización de la lista.
- Las casillas de equipo y la activación/desactivación de los Efectos Activos están enlazadas, pero también se pueden cambiar a mano.

### Accesorios
- Se pueden configurar las casillas de equipo, la parte del cuerpo donde se equipan y las especializaciones.
- En estos objetos no se suelen usar ni la prueba ni el poder.
- Gestiónalo a mano, ya que no se ha implementado ninguna restricción para equipar varias cosas en la misma parte del cuerpo.
- El bono de los Objetos personales se refleja automáticamente si hay un Efecto configurado. La casilla de Objetos personales solo cambia la visualización de la lista.
- Las casillas de equipo y la activación/desactivación de los Efectos Activos están enlazadas, pero también se pueden cambiar a mano.

### Objeto
- Se pueden introducir la cantidad y el precio.
- Al seleccionar un Tipo, se aplicarán la Clase y los valores de atributo de esa Clase al usarlo.
- Úsalo con flexibilidad combinando tirada de dados y poder según convenga a cada objeto.

### Conjuros
- Se pueden configurar el sistema de magia, nivel, tipo de acción, consumo de PM, objetivo, alcance/forma, duración, resistencia, tipo y resumen.
- Úsalo con flexibilidad combinando tirada de dados y poder.
- Si has seleccionado una Clase de conjuros en la pestaña Conjuros del personaje, la Clase seleccionada y el atributo por defecto se elegirán automáticamente cuando las Clases y atributos de prueba y poder estén sin seleccionar. Ten en cuenta que no quedan enlazados.
- Si no seleccionas un sistema de magia, no aparecerá correctamente en la lista de la hoja de personaje.
- En la Magia Divina se añaden la selección de los sistemas Sagrado y Vicio, y campos de entrada para la magia divina especializada.
- En Magitecnología se añade un campo de entrada para la Magiesfera.
- En la Magia de las Hadas se añade un campo de entrada para el tipo y (cuando hace falta) el atributo.
- En la Magia de la Naturaleza se añade una casilla para contrarrestar con Fortaleza.
- Algunos conjuros son más fáciles de gestionar si se prepara un Efecto que aplique un potenciador o penalizador.
- En el botón "Coste de PM" que aparece en el chat, el coste se puede multiplicar usando el botón "Metamagia".

### Técnica
- Se pueden configurar el tipo de acción, nivel, consumo de PM, duración y resumen.
- La aplicación automática de efectos se puede activar usando los Efectos de la sección Detalles.

### Cantos de conjuro・Finales
- Se pueden configurar los siguientes elementos: selección de canto de conjuro y final, nivel, resistencia, tipo, canto, mascotas, Condiciones de ritmo, Ritmo base, Ritmo extra, Valor de floritura, Ritmo extra, Ritmo consumido y resumen.
- Los elementos de configuración cambian según el tipo de canto de conjuro y final.
- Algunas canciones son más fáciles de gestionar si se prepara un Efecto que aplique un potenciador o penalizador.
- El consumo del recurso Ritmo no está automatizado. (Se querría implementar, pero probablemente no se pueda)

### Acrobacias de montura
- Se pueden configurar el tipo de acción, nivel, requisito previo, montura compatible, parte aplicable y resumen.
- Algunas Acrobacias son más fáciles de gestionar si se prepara un Efecto que aplique un potenciador o penalizador.

### Evocaciones alquímicas
- Se pueden configurar el tipo de acción, nivel, objetivo, alcance/área, duración, resistencia, coste en Cartas y resumen.
- La aplicación automática de efectos se puede activar usando los Efectos de la sección Detalles.
- El consumo del recurso Cartas no está automatizado. (Se querría implementar, pero probablemente no se pueda)

### Aspectos
- Se pueden configurar el tipo de Qi, coste de Qi, duración, tipo, nivel y resumen.
- La aplicación automática de efectos se puede activar usando los Efectos de la sección Detalles.
- El consumo del recurso Qi no está automatizado. (Se querría implementar, pero probablemente no se pueda)

### Estratagemas de combate・Maniobras
- Puedes configurar la Estratagema y la Maniobra, tipo de acción, nivel, coste de Filo, Tipo (Línea), rango, Filo acumulado, requisitos previos, condiciones y resumen.
- Los elementos de configuración cambian según si seleccionas Estratagema o Maniobra.
- La aplicación automática de efectos se puede activar usando los Efectos de la sección Detalles.
- El cambio del recurso Filo no está automatizado. (Se querría implementar, pero probablemente no se pueda)

### Prueba
- Es un objeto único y no tiene función de clic en el icono.
- Puedes seleccionar el comportamiento al hacer clic en el nombre y el valor en la hoja de personaje.
- Si marcas "Combate", también aparecerá en la pestaña Combate.

### Recurso
- Solo se pueden introducir la cantidad, el precio y la descripción.

### Dote de combate
- Se pueden introducir el tipo, tipo de acción, requisito previo, contenido del requisito, uso, aplicación, riesgo y resumen.
- También puedes marcar el soporte para la Dote de Vagabundo y la Dote adicional de Danzarín de batalla.
- Las Escuelas también usan este objeto.
  - Si marcas "Secreto", se pueden introducir el nombre de la escuela, la fama requerida, el tipo de secreto y las condiciones previas.
- Algunas Dotes son más fáciles de gestionar si se prepara un Efecto que aplique un potenciador o penalizador.

### Clase
- Se pueden configurar el nivel, la tabla de experiencia y el tipo de Clase.
- Si se configura la tabla de experiencia, el consumo de experiencia se calcula automáticamente.
- El tipo de Clase se usa para calcular los PM, sobre todo para las técnicas de mago, así que asegúrate de configurarlo bien.

### Habilidad racial
- Se pueden configurar los usos restantes y la descripción.
- Los usos restantes están pensados para habilidades con un número limitado de usos.
- Algunas habilidades son más fáciles de gestionar si se prepara un Efecto que aplique un potenciador o penalizador.

### Idioma
- Hay casillas de "Hablado" y "Escrito".

### Habilidad de monstruo
- Se pueden introducir el tipo de acción y las observaciones.
- No hay elementos de Fortaleza y Voluntad para los monstruos. Regístralos con esta habilidad.
  - Fortaleza y Voluntad se crean automáticamente.
  - Los nombres de etiqueta "Fortaleza" y "Voluntad" se usan para determinar si aplican ciertos Efectos Activos.
- Usa este elemento también para las habilidades básicas (por ejemplo, ataques normales).
  - Se crean automáticamente tres pruebas: Acierto, Daño y Evasión.
  - Los nombres de etiqueta "Acierto", "Daño" y "Evasión" se usan para determinar si aplican ciertos Efectos Activos.
- Usa este elemento también para las habilidades que permiten resistencia.
  - Las tiradas de dados se pueden hacer marcando una de las Pruebas. Usa una etiqueta con "Lanzamiento de conjuros" o similar. También se pueden usar valores fijos.
  - La resistencia y sus resultados se pueden introducir en el campo de observaciones como "evita/anula" para mejorar la legibilidad.
- Sobre la magia
  - La magia está pensada para registrarse como objeto de habilidad mágica.
  - La magia individual puede usar los mismos objetos que los PJ, pero también se puede expresar como habilidad de monstruo.
- El campo de Observaciones conviene usarlo con flexibilidad además de lo anterior. Aparecerá en la lista.
- A diferencia de los objetos normales, se pueden usar hasta tres tipos de pruebas.
- Hay un campo de entrada de etiqueta para pruebas y poder. El nombre de la etiqueta será la etiqueta de la parte tirable con clic que se muestra en la lista.
- Para las pruebas, además de configurar un valor base y un valor modificado, una prueba de valor fijo fijará la tirada en 7, y se puede usar otro tipo de dados mediante la opción personalizada.
- Algunas habilidades se pueden preparar con Efectos para hacerlas más manejables, pero los efectos solo se aplican parcialmente.
- La mayoría de las habilidades de monstruo se deberían poder gestionar con este objeto, así que úsalo con flexibilidad.

## Tiradas de dados

### Tiradas de poder
- Cuando se despliega el resultado de la tirada en el chat haciendo clic, se muestran los botones "Crítico a la mitad" y "Sin C".
- Al hacer clic en el botón "Mitad" se recalculan y se vuelven a mostrar los resultados sin crítico, con daño a la mitad y con el daño a la mitad aplicado. Vuelve a hacer clic para devolver los resultados a su estado original.
- Al hacer clic en el botón "Crítico a la mitad" se recalculan y se vuelven a mostrar los resultados con crítico, daño a la mitad y daño a la mitad aplicado. Vuelve a hacer clic para devolver los resultados a su estado original.
- Al hacer clic en "Sin C" se recalcula y se vuelve a mostrar el resultado sin críticos. Vuelve a hacer clic para devolver los resultados a su estado original.
- El botón "Crítico a la mitad" no se muestra en los resultados si el objeto tiene marcado "Mitad" en su detalle. No está soportado por la posibilidad de tiradas adicionales.
- El botón "Sin C" no se muestra en el resultado cuando el objeto está configurado para no tener valor crítico en el detalle. No está soportado por la posibilidad de tiradas adicionales.
- El botón "Sin C" no se muestra para resultados que no son críticos.

### Aplicación de resultados
- Cuando se configura "Aplicar" en los ajustes de tirada de dados y de poder de cada objeto, se muestran en los resultados distintos botones que se pueden aplicar a un actor objetivo.
- Selecciona un objetivo y haz clic en el botón correspondiente según se describe abajo para subir o bajar PV o PM (no se admiten varios objetivos).
  - [✔ PDMG] Se aplica daño físico al objetivo y se reducen sus PV. El daño mostrado es el valor tras aplicar la Protección del objetivo (puntos de protección).
  - [✔ MDMG] Se aplica daño mágico al objetivo y se reducen sus PV. El daño mostrado es el valor tras aplicar la Protección mágica del objetivo.
  - [✔ FDMG] Se aplica daño fijo al objetivo y se reducen sus PV. El daño se aplica directamente al objetivo.
  - [✔ HPR] Se aplica recuperación de PV al objetivo y suben sus PV. No subirá los PV del objetivo por encima de su valor máximo.
  - [✔ MPR] Se aplica recuperación de PM al objetivo y suben sus PM. No subirá los PM del objetivo por encima de su valor máximo.

### Tabla de poder genérica
- Si la tabla de poder del objeto está en blanco, se consulta la tabla de poder genérica y se muestra el resultado.
- El orden de consulta es: Ajustes del objeto → Tabla de poder genérica en el mundo → Tabla de poder genérica en el compendio.
  - El orden de consulta en los compendios es el orden alfabético del nombre del compendio.
  - La tabla de poder genérica consultada es la página "Reference Power Table" del documento "Reference Data".
- Editar la tabla de poder genérica
  - Se recomienda copiar y editar el "Reference Data" de los compendios adjuntos a otros compendios o documentos del mundo.
  - Al copiar a un compendio que no sea el adjunto, asegúrate de que el nombre del compendio vaya antes que el nombre del compendio adjunto "Reference" en orden alfabético (por ejemplo, con un guion bajo delante), por la prioridad de consulta.
  - Introduce solo números en los campos correspondientes, ya que no se reconocerán si se rompe la estructura HTML. Ten cuidado de no incluir espacios ni similares.
  - **¡Atención!** Aunque desbloquees el compendio adjunto y lo edites, se seguirá consultando, pero se reiniciará al actualizar el sistema.
- El contenido editado de la tabla de poder genérica se actualiza al entrar en el mundo. Recarga después de editar.
- La descripción en japonés de la Reference Power Table es la siguiente. No hay problema en borrar o cambiar la descripción de la Reference Power Table copiada.
  - La columna P es el Valor de poder.
  - Se recomienda duplicar el "Reference Data" adjunto en tu mundo, compendios locales, etc. para editarlo.
  - Al duplicar los datos en tus propios compendios, el nombre del compendio debe ir antes que "Reference" en orden alfabético (por ejemplo, con un guion bajo al principio).
  - Hay que recargar después de editar.
  - ¡Atención! ¡Los compendios adjuntos se reinician al actualizar el sistema!

## Efectos

### Clasificación de Efectos (potenciadores y penalizadores)
- Por norma general, se asume que los Efectos se configuran en los objetos, y que se aplican a los personajes cuando estos los poseen.
- También es posible crear efectos en la hoja de personaje y aplicarlos directamente al personaje.

#### Efectos temporales
- Efectos que están activos y tienen una duración de aplicación.
- Útiles para magia, Objetos personales y Dotes de combate que tienen duración.
- Se pueden activar y desactivar.
- Puedes cambiar la clasificación a siempre activo dejando la duración en blanco.

#### Efectos pasivos
- Efectos que están activos y no tienen duración.
- Útiles para accesorios, rasgos raciales y los efectos de cualquier Objeto personal.
- Se pueden activar y desactivar.
- Puedes cambiar la clasificación a temporal introduciendo una duración.

#### Efectos inactivos
- Son Efectos temporales y Efectos pasivos que se han desactivado.
- Los Efectos nuevos creados bajo esta lista se crean como Efectos temporales desactivados.

### Ajustes de Efectos

#### Pestaña Detalles
- Puedes configurar el color del icono y la descripción del Efecto.
- Marcar "Efecto suspendido" tiene la misma función que activarlo/desactivarlo en la lista.
- Los Efectos procedentes de objetos tendrán una casilla para indicar si deben aplicarse o no al personaje que los posee.

#### Pestaña Duración
Puedes configurar la duración en el campo Duración del Efecto (Turnos).
- Se recomienda usar la configuración en turnos, ya que configurarla en segundos no afecta a la funcionalidad.
- El turno inicial se introduce automáticamente durante el combate, pero también se puede cambiar a mano.
- El mod "Times Up" se puede usar para reducir automáticamente la duración de la configuración por turnos.
  - Como la regla "el efecto dura hasta el inicio del turno del propio personaje" es específica de Sword World y no se puede aplicar, habrá una pequeña discrepancia si se usa este mod.

#### Pestaña Efectos
- Se pueden crear varios efectos para un solo potenciador/penalizador haciendo clic en el botón +.
- Selecciona el tipo y el contenido de la clave de atributo desde el menú desplegable. También puedes introducir claves seleccionando "Entrada directa".
- También se pueden introducir valores negativos para los valores de efecto.
- **¡Atención!** Sobre las claves de atributo (Nota de traducción: esta sección no está clara)
  - La modificación del valor crítico no se refleja en la prueba de poder de los objetos mágicos. Usa el modificador de valor crítico mágico para los objetos mágicos.
  - Los ataques especiales y el Rayo crítico en los PJ solo se aplican al arma seleccionada.
  - Todos los elementos que tienen pruebas en el PJ solo se reflejan en los elementos de la parte izquierda de la pestaña Prueba. No se aplica a las técnicas de la parte izquierda, ni al acierto, evasión, magia, etc. de la pestaña Combate.
  - Todos los elementos que tienen pruebas en monstruos se reflejan en todos los elementos excepto Acierto y Magia.
  - Todas las pruebas de técnica de los PJ se reflejarán en la parte derecha de la pestaña Prueba.
  - Cada Poder mágico, incluido Todo el poder mágico, también se refleja en la Prueba de poder.
  - Todos los elementos que tienen pruebas, Toda la magia, y las pruebas y magia individuales se duplican.
  - Todo lo que tiene Ahorro de PM se puede aplicar a más cosas que solo los conjuros.

### Cómo aplicar Efectos

#### Aplicados a tu propio personaje
- Activa el Efecto en la pestaña Efectos para aplicarlo a tu personaje.

#### Aplicados a otros personajes
- Selecciona como objetivo al personaje al que quieras aplicar el Efecto. Se pueden seleccionar y aplicar a varios objetivos a la vez.
- Tras seleccionar el objetivo, haz clic en el botón Efectos de la lista de tu hoja de personaje o en el botón Efecto del chat para aplicar los Efectos al objetivo.
- Los Efectos aplicados se pueden ver en la pestaña Efectos del personaje. Se pueden activar o desactivar personaje por personaje.
- Si se aplica más de un Efecto Activo a un objeto, se aplicarán todos. Los Efectos Activos innecesarios hay que quitarlos a mano después de aplicarlos.
- Los Efectos temporales que están desactivados se activarán al aplicarse.

### Notas sobre los Efectos
- Todos los cambios de clave de atributo de los Efectos Activos solo son efectivos para PJ, por ejemplo de PJ a PJ o de Demonio a PJ.
- Solo algunas claves de atributo son efectivas en monstruos; el resto se ignoran, pero se pueden usar para gestionar la duración, etc.
- Es poco probable que se use la entrada directa de claves de atributo.
- Ten en cuenta que no se gestionan los duplicados de un mismo Efecto, así que cuidado con las duplicaciones no intencionadas.
- **¡Atención!** Los Efectos de los Efectos Activos solo se pueden ver en el valor total de la pestaña Efectos.
- **¡Atención!** Algunas claves de atributo de los Efectos Activos no se actualizan tras cargar el Mundo, pero se actualizan solas en cuanto hagas cualquier ajuste en la Hoja de personaje.
  - Ejemplos de ajuste: activar/desactivar la Gracia, introducir modificadores, actualizar los PV actuales, activar/desactivar Efectos Activos, etc.

## Control de capas (barra de herramientas de la izquierda de la pantalla)
Botón de petición de tirada
- Se ha añadido un botón de petición de tirada al submenú de los Controles de Token (solo DJ).
- Se mostrará en el chat un botón para hacer pruebas por Clase y elementos de Prueba, y cada jugador podrá hacer la Prueba indicada pulsando el botón.
- La lista desplegable mostrará las Clases y elementos de Prueba que poseen los tokens colocados actualmente en la escena.
- El DJ puede configurar el número objetivo.
- Si se configura un número objetivo, el éxito o el fracaso también se determinarán automáticamente.

## Comandos de chat (comandos personalizados)
- Todos los comandos siguientes requieren tener activado el módulo "Chat Commander".
- Sin "Chat Commander", los comandos personalizados no están disponibles, pero el resto de funciones sí se pueden usar.
- Ten en cuenta que no es posible enviar un mensaje tirable entre dos corchetes como con el comando de tirada del núcleo.

### Comandos de chat para tiradas de poder
- Todos estos comandos sirven para hacer una tirada de poder: "/powerroll", "/powroll", "/powr", "/rollpower", "/rollpow", "/rpow", "/rp", "/pow".
- Las tiradas de poder se pueden hacer desde el campo de entrada del chat escribiendo la expresión de tirada de poder después del comando.
- Puedes escribir texto de comentario después de la expresión de tirada de poder.
- Todas las salidas se mostrarán como si tuvieran el botón "aplicar" activado.
- **Cuidado** Tienes que preparar la Reference Power Table para poder usar la expresión de tirada de poder.

#### Formato de las expresiones de tirada de poder
- Sustituye <x> por cualquier número en las descripciones de expresiones siguientes.
- El formato está adaptado de la notación de BCDice, pero el comportamiento se ha modificado.
- "k<x>" Indica el Poder (obligatorio, p. ej. k10 para Poder 10)
- "@<x>" Indica el Valor crítico de la tirada. (opcional; si se omite, por defecto 10, p. ej. k10@10)
- "+<x>" y "-<x>" Indican el valor de modificación de la tirada. (opcional, p. ej. k10+2)
- "h", "h+<x>", "h-<x>" Indican partir por la mitad la tirada de poder, y además sumar o restar un valor modificado después de partir por la mitad. (opcional; el valor crítico será 13 por defecto, p. ej. k10+2h k10+2h-1)
- "#<x>" Indica subir la tirada de poder 1 escalón por ataques especiales, como el Golpe letal. (opcional, normalmente 1, p. ej. k10@10+2#1)
- "$+<x>", "$-<x>" Indican el valor del modificador de Poder para un Rayo crítico (opcional, p. ej. k10+2$+2)
- "$f+<x>" Indica hacer que la primera tirada sea un número fijo igual a <x>. Esta función también sirve para el "Cambiar el destino" de los humanos.
- "tf<x>" Indica fijar un dado en el número X y tirar el segundo dado, como al usar las Herramientas de boticario (opcional, normalmente 4, p. ej. k10@13tf4 equivale a tirar 1d6+4 en la tabla de Poder 10).
- "r<x>" Indica el incremento de la tabla de poder al usar la Hoja del verdugo (opcional, normalmente 5, p. ej. k10@10+2r5).

## Ajustes del sistema de juego

### Configurar el objetivo de aplicación de los Efectos Activos
- Ajustes para PJ
  - Puedes configurar el "nombre del elemento" de la Prueba que corresponde a la clave de atributo.
  - El nombre del elemento de la Prueba creada automáticamente es el valor por defecto.
  - Si cambias el ajuste, el nombre del elemento también tiene que ser el mismo; si no, los Efectos Activos no se aplicarán.
- Ajustes para monstruos
  - Puedes configurar el "nombre de etiqueta" de la habilidad de monstruo que corresponde a la clave de atributo. Los nombres de elemento no se tienen en cuenta.
  - El nombre de etiqueta por defecto es el configurado en la habilidad de monstruo creada automáticamente.
  - Si cambias el ajuste, el nombre de etiqueta también tiene que ser el mismo; si no, los Efectos Activos no se aplicarán.
  - **¡Ojo!** En el caso de las habilidades de monstruo, la comprobación se hace por el nombre de etiqueta, no por el nombre del elemento. Ten cuidado con esto.

## Soporte de macros

### Macro de importación de YutoSheetII
- (https://yutorize.2-d.jp/ytsheet/sw2.5/)
- ~~[yt2import] Se incluye una macro para importar desde YutoSheetII.~~ >> [Sword World 2.5 Support Tools](https://github.com/keyslock/sw25-fvtt-support)
  - Prepara un archivo JSON exportado desde la web de YutoSheetII.
  - Usa la macro, selecciona el archivo JSON de YutoSheetII y pulsa importar.
  - Los datos tratados como objetos se buscan en el orden "Lista de objetos del mundo" -> "Lista de objetos del compendio (orden alfabético)", y si existe un objeto con el nombre coincidente, se importan los datos. Si no, se crea un objeto nuevo.
- Precauciones
  - Solo se admiten PJ y monstruos.
  - Los objetos y la magia, salvo el equipo, no se importan.
  - Algunas razas no importarán automáticamente sus idiomas iniciales aprendidos, y habrá que añadirlos a mano.
  - Las partes adicionales de los accesorios no están soportadas.
  - Las habilidades de monstruo se pueden importar como lista o como objetos individuales (beta).
  - Si importar las habilidades de monstruo como objetos individuales no funciona, desmarca la casilla antes de importar.
  - Los objetos nuevos creados sin un nombre coincidente habrá que configurarlos a mano.
  - Algunos objetos con datos importados también pueden necesitar configuración manual.
  - Los datos que no se importen habrá que añadirlos a mano.

## Precauciones
- El manejo de errores es laxo.
- Aparece un mensaje de advertencia en la consola, pero como no hay problema de funcionamiento, se ha dejado así de momento.
- No se ha probado la compatibilidad con mods. Es compatible con "Dice So Nice!", "Times Up" y "Chat Commander".
- El diseño no se ha validado en inglés.
- Con permisos limitados para PNJ y monstruos, los iconos y las imágenes no se cambian.
- Se recomienda usar el mod "Times Up" para gestionar la duración de potenciadores y penalizadores.
- "Chat Commander" es necesario para usar los comandos de chat personalizados.
- El combate no está implementado. Se recomienda llevar la iniciativa a mano o instalar mods.
- Ejemplos de mods que ayudan con el orden de acción (personalmente creo que la Iniciativa Popcorn encaja bien aquí)
  - Tipo Popcorn: "Lancer Initiative" y "Just Popcorn Initiative"
  - Tipo grupo: "Combat Tracker Extensions" y "Combat Tracker Groups"
