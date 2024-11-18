// Função para exportar para XLSX
async function exportToExcel(exportType) {
    try {
        const response = await fetch(`/funcionario/php/exportar/export_data.php?export_type=${exportType}`);
        const result = await response.json();

        if (result.status === "success") {
            const wb = XLSX.utils.book_new(); // Cria uma nova planilha
            const ws = XLSX.utils.json_to_sheet(result.data); // Converte os dados em uma planilha

            // Adiciona a planilha ao workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            // Criar os cabeçalhos das colunas
            const headers = Object.keys(result.data[0]).map(header => {
                return header.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
            });

            // Adiciona os cabeçalhos no índice correto
            headers.forEach((header, index) => {
                ws[XLSX.utils.encode_cell({ r: 0, c: index })] = {
                    v: header,
                    s: { font: { bold: true }, alignment: { horizontal: "center" } }
                };
            });

            // Ajusta a largura das colunas para o conteúdo
            const colWidths = headers.map(header => {
                const maxWidth = Math.max(...result.data.map(item => String(item[header]).length));
                return { wpx: maxWidth * 10 }; // Ajuste do tamanho da coluna
            });
            ws['!cols'] = colWidths;

            // Escreve o arquivo XLSX
            XLSX.writeFile(wb, `${exportType}.xlsx`);
        } else {
            console.error("Erro ao buscar dados:", result.message);
        }
    } catch (error) {
        console.error("Erro:", error);
    }
}

// Função para exportar para PDF
async function exportToPDF(exportType) {
    try {
        const response = await fetch(`/funcionario/php/exportar/export_data.php?export_type=${exportType}`);
        const result = await response.json();

        if (result.status === "success") {
            const { jsPDF } = window.jspdf;

            // Definindo o formato da página como paisagem
            const doc = new jsPDF('portrait'); 

            doc.setFontSize(16);
            doc.setTextColor(30, 144, 255); // Cor do texto para o título
            doc.text(`${exportType} - Relatório`, 20, 20);

            doc.text('', 10, 30);  // Espaçamento extra

            const headers = Object.keys(result.data[0]).map(header => {
                return header.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
            });

            // Largura total da página (em mm)
            const pageWidth = doc.internal.pageSize.width;
            const margin = 10; // Margem de 10mm em ambos os lados
            const availableWidth = pageWidth - 2 * margin;

            // Criação da tabela usando autoTable
            doc.autoTable({
                head: [headers], // Cabeçalhos da tabela
                body: result.data.map(item => Object.values(item)), // Corpo da tabela com os dados
                startY: 40, // Posição Y inicial para a tabela
                margin: { top: 20, left: margin, right: margin }, // Margens laterais
                styles: {
                    fontSize: 10, // Tamanho da fonte
                    cellPadding: 1, // Preenchimento nas células
                    overflow: 'linebreak', // Quebra de linha se necessário
                    halign: 'center', // Alinhamento horizontal das células
                },
                headStyles: {
                    fillColor: [3, 52, 110], // Cor de fundo do cabeçalho
                    textColor: [255, 255, 255], // Cor do texto do cabeçalho
                    fontStyle: 'bold', // Estilo do texto do cabeçalho
                    halign: 'center', // Alinhamento horizontal do cabeçalho
                },
                tableWidth: availableWidth, // A largura total disponível para a tabela
                didDrawPage: function (data) {
                    // Se a tabela não couber na página, crie uma nova página
                    if (data.cursor.y > 250) { // 250 é um valor estimado antes de ultrapassar a página
                        doc.addPage();
                    }
                }
            });

            doc.save(`${exportType}.pdf`);
        } else {
            console.error("Erro ao buscar dados:", result.message);
        }
    } catch (error) {
        console.error("Erro:", error);
    }
}



// Evento de mudança para selecionar o tipo de exportação
document.querySelector('.select-export').addEventListener('change', function () {
    const modeExport = document.getElementById('mode-export');
    const spanArchive = document.querySelector('.span-archive');
    const archiveName = document.querySelector('.archive');
    const exportDownloadSelectValue = document.querySelector('.select-export-download').value;

    if (this.value) {
        modeExport.style.display = 'block';
    } else {
        modeExport.style.display = 'none';
    }

    archiveName.classList.remove('bi-file-earmark-excel-fill', 'bi-file-earmark-pdf-fill');

    if (exportDownloadSelectValue === 'XLSX' && this.value) {
        spanArchive.textContent = `${this.value}.xlsx`;
        archiveName.classList.add('bi', 'bi-file-earmark-excel-fill');
    } else if (exportDownloadSelectValue === 'PDF' && this.value) {
        spanArchive.textContent = `${this.value}.pdf`;
        archiveName.classList.add('bi', 'bi-file-earmark-pdf-fill');
    } else {
        spanArchive.textContent = '';
    }
});

// Evento de mudança para selecionar o formato de exportação (XLSX ou PDF)
document.querySelector('.select-export-download').addEventListener('change', function () {
    const downloadArea = document.getElementById('download-area');
    const spanArchive = document.querySelector('.span-archive');
    const archiveName = document.querySelector('.archive');
    const firstSelectValue = document.querySelector('.select-export').value;

    if (this.value) {
        downloadArea.style.display = 'block';
    } else {
        downloadArea.style.display = 'none';
    }

    archiveName.classList.remove('bi-file-earmark-excel-fill', 'bi-file-earmark-pdf-fill');

    if (this.value === 'XLSX' && firstSelectValue) {
        spanArchive.textContent = `${firstSelectValue}.xlsx`;
        archiveName.classList.add('bi', 'bi-file-earmark-excel-fill');
    } else if (this.value === 'PDF' && firstSelectValue) {
        spanArchive.textContent = `${firstSelectValue}.pdf`;
        archiveName.classList.add('bi', 'bi-file-earmark-pdf-fill');
    } else {
        spanArchive.textContent = '';
    }
});

// Evento de clique para iniciar o download
document.querySelector('.btn-download').addEventListener('click', function () {
    const exportType = document.querySelector('.select-export').value;
    const format = document.querySelector('.select-export-download').value;

    if (format === 'XLSX' && exportType) {
        exportToExcel(exportType);
    } else if (format === 'PDF' && exportType) {
        exportToPDF(exportType);
    }
});
