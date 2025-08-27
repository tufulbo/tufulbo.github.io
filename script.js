    let team1 = [];
    let team2 = [];
    let playerElements = { team1: [], team2: [] };
    let parsedPlayers = [];
    let currentFormation = 7;
    let selectedPlayer = null;
    let matchHour = 23;
    let matchMinutes = 0;
    let matchFee = 3500;

    function init() {
      var textAreas = document.getElementsByTagName('textarea', 'div');
      Array.prototype.forEach.call(textAreas, function(elem) {
          elem.placeholder = elem.placeholder.replace(/\n/g, '\n');
      });
      // Restaurar formación desde la URL si existe
      restoreFormationFromURL();
      updateMatchInfo();
  // Ya no es necesario crear el botón aquí, se encuentra en el HTML
    }
    // Serializa la formación y la información relevante en la URL
    function getFormationURL() {
      const data = {
        team1,
        team2,
        formation: currentFormation,
        hour: matchHour,
        minutes: matchMinutes,
        fee: matchFee
      };
      const params = new URLSearchParams();
      params.set('formation', btoa(encodeURIComponent(JSON.stringify(data))));
      return window.location.origin + window.location.pathname + '?' + params.toString();
    }

    // Copia el link al portapapeles
    function shareFormationLink() {
      const url = getFormationURL();
      navigator.clipboard.writeText(url).then(() => {
        alert('¡Link copiado al portapapeles!');
      }).catch(() => {
        fallbackShare('Copia este link: ' + url);
      });
    }

    // Restaura la formación desde la URL si existe
    function restoreFormationFromURL() {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get('formation');
      if (encoded) {
        try {
          const decoded = decodeURIComponent(atob(encoded));
          const data = JSON.parse(decoded);
          if (data.team1 && data.team2) {
            team1 = data.team1;
            team2 = data.team2;
            parsedPlayers = [...team1, ...team2];
            currentFormation = data.formation || 7;
            matchHour = data.hour || 23;
            matchMinutes = data.minutes || 0;
            matchFee = data.fee || 3500;
            // Actualizar campos visuales si existen
            if (document.getElementById('playerList')) {
              document.getElementById('playerList').value = parsedPlayers.join('\n');
            }
            if (document.getElementById('matchHour')) {
              document.getElementById('matchHour').value = matchHour;
            }
            if (document.getElementById('matchMinutes')) {
              document.getElementById('matchMinutes').value = matchMinutes.toString().padStart(2, '0');
            }
            if (document.getElementById('matchFee')) {
              document.getElementById('matchFee').value = matchFee;
            }
            renderPlayers();
          }
        } catch (e) {
          // Si hay error, ignorar y no restaurar
        }
      }
    }

    function updateHour(change) {
        const hourInput = document.getElementById('matchHour');
        
        
        if (change !== undefined) {
            matchHour = (matchHour + change + 24) % 24;
            hourInput.value = matchHour;
        } 
        
        else {
            const inputValue = parseInt(hourInput.value);
            matchHour = isNaN(inputValue) ? 0 : (inputValue + 24) % 24;
            hourInput.value = matchHour;
        }
        
        updateMatchInfo();
    }
    
    function updateMinutes(change) {
        const minutesInput = document.getElementById('matchMinutes');
        
        
        if (change !== undefined) {
            matchMinutes = (matchMinutes + change + 60) % 60;
            minutesInput.value = matchMinutes.toString().padStart(2, '0');
        } 
        
        else {
            const inputValue = parseInt(minutesInput.value);
            matchMinutes = isNaN(inputValue) ? 0 : (inputValue + 60) % 60;
            minutesInput.value = matchMinutes.toString().padStart(2, '0');
        }
        
        updateMatchInfo(); 
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
        
        updateMatchInfo();
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
      
      
      const hasEmptyLines = lines.some(line => line.trim() === '');
      const hasEmojis = lines.some(line => /[✅❌]/.test(line));
      
      let players = [];
      
      if (!hasEmptyLines && !hasEmojis) {
        
        players = lines.map(line => line.trim()).filter(line => line !== '');
      } else {
        
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
      
      const field = document.querySelector('.field-container');
      const existingPlayers = document.querySelectorAll('.player-btn');
      existingPlayers.forEach(player => player.remove());
      
     
      playerElements = { team1: [], team2: [] };
    
     
      const team1Positions = getTeamPositions(true);
      
      
      const team2Positions = getTeamPositions(false);
    
     
      team1.forEach((player, index) => {
        if (index < team1Positions.length) {
          const btn = createPlayerButton(player, team1Positions[index], 'team1', index);
          playerElements.team1.push(btn);
        }
      });
      
      
      team2.forEach((player, index) => {
        if (index < team2Positions.length) {
          const btn = createPlayerButton(player, team2Positions[index], 'team2', index);
          playerElements.team2.push(btn);
        }
      });
      
      
      updatePlayerSelection();
    }

    function getTeamPositions(isTopTeam) {
      
      const positions = [
        
        [50, isTopTeam ? 5 : 95],
        
        [20, isTopTeam ? 20 : 80],
        [50, isTopTeam ? 20 : 80],
        [80, isTopTeam ? 20 : 80],
        
        [15, isTopTeam ? 35 : 65],
        [85, isTopTeam ? 35 : 65],
       
        [50, isTopTeam ? 40 : 60]
      ];
    
     
      if (currentFormation === 6) {
        return positions.filter((_, i) => i !== 6); 
      } else if (currentFormation === 5) {
        return positions.filter((_, i) => ![4, 5].includes(i));
      }
      
      return positions;
    }

    function createPlayerButton(name, position, team, index) {
      const btn = document.createElement('button');
      btn.className = `player-btn ${team}-player`;
      
      
      btn.style.left = `${position[0]}%`;
      btn.style.top = `${position[1]}%`;
      
      btn.textContent = name;
      btn.dataset.team = team;
      btn.dataset.index = index;
      
    
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
     
        selectedPlayer = { team, index };
        updatePlayerSelection();
      } else {
        
        if (selectedPlayer.team === team) {
          
          const teamArray = team === 'team1' ? team1 : team2;
          [teamArray[selectedPlayer.index], teamArray[index]] = [teamArray[index], teamArray[selectedPlayer.index]];
        } else {
       
          const team1Array = selectedPlayer.team === 'team1' ? team1 : team2;
          const team2Array = team === 'team2' ? team2 : team1;
          const index1 = selectedPlayer.index;
          const index2 = index;
          [team1Array[index1], team2Array[index2]] = [team2Array[index2], team1Array[index1]];
        }
        
       
        parsedPlayers = [...team1, ...team2];
        document.getElementById('playerList').value = parsedPlayers.join('\n');
        
        selectedPlayer = null;
        renderPlayers();
      }
    }

    function updatePlayerSelection() {
      
      document.querySelectorAll('.player-btn').forEach(btn => {
        btn.classList.remove('selected');
      });
      
     
      if (selectedPlayer) {
        const teamArray = playerElements[selectedPlayer.team];
        if (teamArray && teamArray[selectedPlayer.index]) {
          teamArray[selectedPlayer.index].classList.add('selected');
        }
      }
    }

    function shareField() {
      const field = document.getElementById('field-container');

      if (!field) {
        alert('No se encontró el campo para compartir.');
        return;
      }

      if (typeof html2canvas === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
        script.onload = () => captureAndShareFieldImage();
        script.onerror = () => alert('No se pudo cargar html2canvas');
        document.head.appendChild(script);
      } else {
        captureAndShareFieldImage();
      }
    }

    function captureAndShareFieldImage() {
      const field = document.getElementById('field-container');

      html2canvas(field).then(canvas => {
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], 'formacion-equipos.png', { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              navigator.share({
                files: [file],
                title: 'Formación de Equipos',
                text: `Hora: ${matchHour.toString().padStart(2, '0')}:${matchMinutes.toString().padStart(2, '0')}\nCosto: $${matchFee}`
              }).catch(err => {
                console.error('Error al compartir:', err);
                alert('No se pudo compartir la imagen.');
              });
            } else {
              alert('La funcionalidad de compartir no está disponible en este dispositivo.');
            }
          } else {
            console.error('Error al generar blob');
            alert('Error al generar imagen');
          }
        }, 'image/png');
      }).catch(err => {
        console.error('Error:', err);
        alert('Error al generar imagen');
      });
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
      const field = document.getElementById('field-container');
      
      if (!field) {
          alert('No se encontró el campo para capturar.');
          return;
      }
    
      html2canvas(field).then(canvas => {
        canvas.toBlob(blob => {
          if (blob) {
            navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]).then(() => {
              console.log('Imagen copiada (resolución adaptada a la pantalla)');
            }).catch(err => {
              console.error('Error al copiar:', err);
              const link = document.createElement('a');
              link.download = 'formacion-equipos-adaptada.png';
              link.href = canvas.toDataURL();
              link.click();
            });
          } else {
            console.error('Error al generar blob');
            alert('Error al generar imagen');
          }
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
    
      const text = `EQUIPO OSCURO:\n${team1List}\n\nEQUIPO CLARO:\n${team2List}\n\nHora: ${matchHour.toString().padStart(2, '0')}:${matchMinutes.toString().padStart(2, '0')}\nCosto: $${matchFee}`;
    
      navigator.clipboard.writeText(text)
      
        .catch(err => {
          console.error('Error al copiar texto:', err);
         
          const textarea = document.createElement('textarea');
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        });
    }

 
    window.onload = init;
