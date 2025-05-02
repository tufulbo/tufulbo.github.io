    // Variables globales
    let team1 = [];
    let team2 = [];
    let playerElements = { team1: [], team2: [] };
    let parsedPlayers = [];
    let currentFormation = 7;
    let selectedPlayer = null;
    let matchHour = 23;
    let matchMinutes = 0;
    let matchFee = 3500;

    // Inicialización
    function init() {
      var textAreas = document.getElementsByTagName('textarea', 'div');
      Array.prototype.forEach.call(textAreas, function(elem) {
          elem.placeholder = elem.placeholder.replace(/\\n/g, '\n');
      });
      updateMatchInfo();
    }

    function updateHour(change) {
        const hourInput = document.getElementById('matchHour');
        
        // Si se usa el botón +/-
        if (change !== undefined) {
            matchHour = (matchHour + change + 24) % 24;
            hourInput.value = matchHour;
        } 
        // Si se edita manualmente
        else {
            const inputValue = parseInt(hourInput.value);
            matchHour = isNaN(inputValue) ? 0 : (inputValue + 24) % 24;
            hourInput.value = matchHour;
        }
        
        updateMatchInfo(); // Actualiza la visualización
    }
    
    function updateMinutes(change) {
        const minutesInput = document.getElementById('matchMinutes');
        
        // Si se usa el botón +/-
        if (change !== undefined) {
            matchMinutes = (matchMinutes + change + 60) % 60;
            minutesInput.value = matchMinutes.toString().padStart(2, '0');
        } 
        // Si se edita manualmente
        else {
            const inputValue = parseInt(minutesInput.value);
            matchMinutes = isNaN(inputValue) ? 0 : (inputValue + 60) % 60;
            minutesInput.value = matchMinutes.toString().padStart(2, '0');
        }
        
        updateMatchInfo(); // Actualiza la visualización
    }
    
    function handleHourChange() {
      let hour = parseInt(document.getElementById('matchHour').value);
      if (isNaN(hour)) hour = 0;
      matchHour = (hour + 24) % 24;
      document.getElementById('matchHour').value = matchHour;
      updateMatchInfo();
    }
    
    function handleMinutesChange() {
      let minutes = parseInt(document.getElementById('matchMinutes').value);
      if (isNaN(minutes)) minutes = 0;
      matchMinutes = (minutes + 60) % 60;
      document.getElementById('matchMinutes').value = matchMinutes.toString().padStart(2, '0');
      updateMatchInfo();
    }

    function updateFee(change) {
        const feeInput = document.getElementById('matchFee');
        
        // Si se usa el botón +/-
        if (change !== undefined) {
            matchFee = Math.max(0, matchFee + change);
            feeInput.value = matchFee;
        } 
        // Si se edita manualmente (evento input/change)
        else {
            const inputValue = parseInt(feeInput.value);
            matchFee = isNaN(inputValue) ? 0 : Math.max(0, inputValue);
            feeInput.value = matchFee; // Actualiza el campo por si hay valores inválidos
        }
        
        updateMatchInfo(); // Actualiza la visualización en el campo
    }

    function setFormation(n) {
      currentFormation = n;
      renderPlayers();
    }

    function updateMatchInfo() {
      const hourStr = matchHour.toString().padStart(2, '0');
      const minutesStr = matchMinutes.toString().padStart(2, '0');
      document.getElementById('matchInfo').innerHTML = `Hora: ${hourStr}:${minutesStr}<br>Costo: $${matchFee}`;
    }

    function assignPlayers() {
      const rawInput = document.getElementById('playerList').value;
      const lines = rawInput.split('\n');
      
      // Verificar si hay líneas vacías o emojis
      const hasEmptyLines = lines.some(line => line.trim() === '');
      const hasEmojis = lines.some(line => /[✅❌]/.test(line));
      
      let players = [];
      
      if (!hasEmptyLines && !hasEmojis) {
        // Si no hay líneas vacías ni emojis, tomar todas las líneas sin filtrar
        players = lines.map(line => line.trim()).filter(line => line !== '');
      } else {
        // Procesamiento original con filtros
        let skip = false;
        
        lines.forEach((line, index) => {
          if (index === 0) return;
          const trimmed = line.trim();
          if (!trimmed || skip) return;
    
          if (/reserva|suplentes/i.test(trimmed)) {
            skip = true;
            return;
          }
    
          if (trimmed.includes('❌')) {
            const afterX = trimmed.split('❌').pop();
            const cleaned = afterX.replace(/[✅❌]/g, '').trim();
    
            const parts = cleaned.split(/(?<=\S)\s+(?=\S)/g).reduce((acc, word) => {
              if (!acc.length || acc[acc.length - 1].split(' ').length >= 3) {
                acc.push(word);
              } else {
                acc[acc.length - 1] += ' ' + word;
              }
              return acc;
            }, []);
    
            players.push(...parts);
          } else if (/[✅❌]/.test(trimmed)) {
            const cleaned = trimmed.replace(/[✅❌]/g, '').trim();
            if (cleaned) players.push(cleaned);
          } else {
            const spaceCount = (trimmed.match(/ /g) || []).length;
            if (spaceCount <= 2) {
              players.push(trimmed);
            }
          }
        });
      }
    
      const half = Math.ceil(players.length / 2);
      team1 = players.slice(0, half);
      team2 = players.slice(half);
    
      parsedPlayers = [...players];
      document.getElementById('playerList').value = players.join('\n');
      selectedPlayer = null;
      renderPlayers();
    }

    function renderPlayers() {
      // Limpiar jugadores existentes
      const field = document.querySelector('.field-container');
      const existingPlayers = document.querySelectorAll('.player-btn');
      existingPlayers.forEach(player => player.remove());
      
      // Resetear array de elementos
      playerElements = { team1: [], team2: [] };
    
      // Posiciones para equipo 1 (arriba)
      const team1Positions = getTeamPositions(true);
      
      // Posiciones para equipo 2 (abajo)
      const team2Positions = getTeamPositions(false);
    
      // Crear botones para equipo 1
      team1.forEach((player, index) => {
        if (index < team1Positions.length) {
          const btn = createPlayerButton(player, team1Positions[index], 'team1', index);
          playerElements.team1.push(btn);
        }
      });
      
      // Crear botones para equipo 2
      team2.forEach((player, index) => {
        if (index < team2Positions.length) {
          const btn = createPlayerButton(player, team2Positions[index], 'team2', index);
          playerElements.team2.push(btn);
        }
      });
      
      // Actualizar selección si hay un jugador seleccionado
      updatePlayerSelection();
    }

    function getTeamPositions(isTopTeam) {
      // Posiciones base (porcentajes para mejor adaptación)
      const positions = [
        // Portero (x, y)
        [50, isTopTeam ? 5 : 95],
        // Defensas
        [20, isTopTeam ? 20 : 80],
        [50, isTopTeam ? 20 : 80],
        [80, isTopTeam ? 20 : 80],
        // Medios
        [30, isTopTeam ? 40 : 60],
        [70, isTopTeam ? 40 : 60],
        // Medio centro
        [50, isTopTeam ? 40 : 60]
      ];
    
      // Ajustar para formaciones
      if (currentFormation === 6) {
        return positions.filter((_, i) => i !== 6); // Quitar medio centro
      } else if (currentFormation === 5) {
        return positions.filter((_, i) => ![4, 5].includes(i)); // Solo porteros y defensas
      }
      
      return positions;
    }

    function createPlayerButton(name, position, team, index) {
      const btn = document.createElement('button');
      btn.className = `player-btn ${team}-player`;
      
      // Aplicar posiciones directamente como estilo
      btn.style.left = `${position[0]}%`;
      btn.style.top = `${position[1]}%`;
      
      btn.textContent = name;
      btn.dataset.team = team;
      btn.dataset.index = index;
      
      // Eventos (mantener los mismos)
      btn.onclick = function(e) {
        e.stopPropagation();
        handlePlayerClick(team, index);
      };
      
      btn.ontouchstart = function(e) {
        e.stopPropagation();
        handlePlayerClick(team, index);
        e.preventDefault();
      };
      
      document.querySelector('.field-container').appendChild(btn);
      return btn;
    }

    function handlePlayerClick(team, index) {
      if (!selectedPlayer) {
        // Seleccionar primer jugador
        selectedPlayer = { team, index };
        updatePlayerSelection();
      } else {
        // Intercambiar jugadores
        if (selectedPlayer.team === team) {
          // Mismo equipo - intercambiar posiciones
          const teamArray = team === 'team1' ? team1 : team2;
          [teamArray[selectedPlayer.index], teamArray[index]] = [teamArray[index], teamArray[selectedPlayer.index]];
        } else {
          // Equipos diferentes - intercambiar jugadores
          const team1Array = selectedPlayer.team === 'team1' ? team1 : team2;
          const team2Array = team === 'team2' ? team2 : team1;
          const index1 = selectedPlayer.index;
          const index2 = index;
          [team1Array[index1], team2Array[index2]] = [team2Array[index2], team1Array[index1]];
        }
        
        // Actualizar lista de jugadores
        parsedPlayers = [...team1, ...team2];
        document.getElementById('playerList').value = parsedPlayers.join('\n');
        
        selectedPlayer = null;
        renderPlayers();
      }
    }

    function updatePlayerSelection() {
      // Remover selección de todos los jugadores
      document.querySelectorAll('.player-btn').forEach(btn => {
        btn.classList.remove('selected');
      });
      
      // Aplicar selección al jugador actual
      if (selectedPlayer) {
        const teamArray = playerElements[selectedPlayer.team];
        if (teamArray && teamArray[selectedPlayer.index]) {
          teamArray[selectedPlayer.index].classList.add('selected');
        }
      }
    }

    function shareField() {
      const playersInput = document.getElementById('playerList').value;
      const players = playersInput.split('\n').filter(name => name.trim() !== '');
      const half = Math.ceil(players.length / 2);
      const team1List = players.slice(0, half).join('\n');
      const team2List = players.slice(half).join('\n');
      const shareText = `Formación de equipos:\n\nEQUIPO CLARO:\n${team1List}\n\nEQUIPO OSCURO:\n${team2List}\n\nHora: ${matchHour.toString().padStart(2, '0')}:${matchMinutes}\nCosto: $${matchFee}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Formación de Equipos',
          text: shareText
        }).catch(err => {
          console.error('Error al compartir:', err);
          fallbackShare(shareText);
        });
      } else {
        fallbackShare(shareText);
      }
    }

    function fallbackShare(text) {
      alert(text);
    }

    function copyFieldAsImage() {
      if (typeof html2canvas === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
        script.onload = () => captureFieldAsImage();
        script.onerror = () => alert('No se pudo cargar html2canvas');
        document.head.appendChild(script);
      } else {
        captureFieldAsImage();
      }
    }
    
    function captureFieldAsImage() {
      const field = document.querySelector('.field-container');
    
      html2canvas(field, {
        backgroundColor: '#006400',
        logging: false,
        useCORS: true,
        allowTaint: true,
        scale: 3, // resolución más alta para mejor calidad
        onclone: (clonedDoc) => {
          const clonedField = clonedDoc.querySelector('.field-container');
          clonedField.style.aspectRatio = 'unset';
          clonedField.style.maxWidth = 'unset';
          clonedField.style.maxHeight = 'unset';
          clonedField.style.width = '720px';
          clonedField.style.height = '1080px';
    
          const parent = clonedField.parentElement;
          if (parent) {
            parent.style.padding = '0';
            parent.style.margin = '0';
            parent.style.display = 'flex';
            parent.style.alignItems = 'center';
            parent.style.justifyContent = 'center';
            parent.style.backgroundColor = '#006400';
            parent.style.width = '720px';
            parent.style.height = '1080px';
          }

          // Hacer jugadores y nombres más grandes
          const players = clonedField.querySelectorAll('.player-btn');
          players.forEach(player => {
            player.style.transform = 'translate(-50%, -50%) scale(1.1)';
            player.style.fontSize = '17px';
            player.style.minWidth = '90px';
            player.style.height = '42px';
          });
        }
      }).then(canvas => {
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = 720;
        finalCanvas.height = 1080;
        const ctx = finalCanvas.getContext('2d');
    
        // Rellenar fondo para asegurarse de que no haya bordes
        ctx.fillStyle = '#006400';
        ctx.fillRect(0, 0, 720, 1080);
    
        ctx.drawImage(canvas, 0, 0, 720, 1080);
    
        finalCanvas.toBlob(blob => {
          navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]).then(() => {
            console.log('Imagen copiada (720x1080)');
          }).catch(err => {
            console.error('Error al copiar:', err);
            const link = document.createElement('a');
            link.download = 'formacion-equipos-720x1080.png';
            link.href = finalCanvas.toDataURL();
            link.click();
          });
        }, 'image/png');
      }).catch(err => {
        console.error('Error:', err);
        alert('Error al generar imagen');
      });
    }
    

    function copyFieldText() {
      if (parsedPlayers.length === 0) {
        alert("No hay jugadores generados aún.");
        return;
      }
    
      const half = Math.ceil(parsedPlayers.length / 2);
      const team1List = parsedPlayers.slice(0, half).join('\n');
      const team2List = parsedPlayers.slice(half).join('\n');
    
      const text = `EQUIPO OSCURO:\n${team1List}\n\nEQUIPO CLARO:\n${team2List}\n\nHora: ${matchHour.toString().padStart(2, '0')}:${matchMinutes}\nCosto: $${matchFee}`;
    
      navigator.clipboard.writeText(text)
      
        .catch(err => {
          console.error('Error al copiar texto:', err);
          // Alternativa para navegadores antiguos
          const textarea = document.createElement('textarea');
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        });
    }

    // Inicializar al cargar
    window.onload = init;
