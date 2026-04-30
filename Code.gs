const SHEET_NAMES = {
  GERAL: 'Geral',
  MEDICAMENTOS: 'Medicamentos',
  ARQUIVO: 'Arquivo_Resolvidos',
};

const EMAIL_ENCOMENDAS = 'drogariasconceitocm@gmail.com';

const HEADERS = {
  Geral: ['ID', 'Timestamp', 'Autor', 'Descricao', 'Resolvido'],
  Medicamentos: [
    'ID',
    'Timestamp',
    'Tipo',
    'Medicamento',
    'Pre_Pago',
    'Cliente',
    'Atendente',
    'Previsao_Entrega',
    'Comprado',
    'Entregue',
    'Telefone',
    'Status',
    'Status_Aviso_WhatsApp',
    'Data_Aviso_WhatsApp',
  ],
  Arquivo_Resolvidos: [
    'Origem',
    'ID',
    'Timestamp',
    'Tipo',
    'Autor',
    'Descricao',
    'Medicamento',
    'Pre_Pago',
    'Cliente',
    'Atendente',
    'Previsao_Entrega',
    'Comprado',
    'Resolvido',
    'Entregue',
    'Telefone',
    'Status',
    'Status_Aviso_WhatsApp',
    'Data_Aviso_WhatsApp',
    'Arquivado_Em',
  ],
};

function doGet() {
  setupSpreadsheet();

  const template = HtmlService.createTemplateFromFile('Index');
  template.initialDataB64 = Utilities.base64EncodeWebSafe(
    JSON.stringify(fetchData()),
    Utilities.Charset.UTF_8
  );

  return template
    .evaluate()
    .setTitle('Solicitacoes Drogaria')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function setupSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  Object.keys(HEADERS).forEach(function (sheetName) {
    const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    ensureHeaders_(sheet, HEADERS[sheetName]);
  });
}

function saveData(tab, data) {
  setupSpreadsheet();

  if (tab !== SHEET_NAMES.GERAL && tab !== SHEET_NAMES.MEDICAMENTOS) {
    throw new Error('Aba invalida: ' + tab);
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(tab);
  const id = Utilities.getUuid();
  const timestamp = new Date();

  if (tab === SHEET_NAMES.GERAL) {
    const row = [
      id,
      timestamp,
      sanitizeText_(data.autor),
      sanitizeText_(data.descricao),
      false,
    ];
    sheet.appendRow(row);
  }

  if (tab === SHEET_NAMES.MEDICAMENTOS) {
    const tipo = sanitizeText_(data.tipo);
    const previsaoEntrega = parseDate_(data.previsaoEntrega);
    if (!previsaoEntrega) {
      throw new Error('Previsao_Entrega invalida. Use o formato YYYY-MM-DD com data real.');
    }

    const row = [
      id,
      timestamp,
      tipo,
      sanitizeText_(data.medicamento),
      toBoolean_(data.prePago),
      sanitizeText_(data.cliente),
      sanitizeText_(data.atendente),
      previsaoEntrega,
      false,
      false,
      sanitizeText_(data.telefone),
      'Pendente',
      '',
      '',
    ];
    sheet.appendRow(row);

    if (tipo.toLowerCase() === 'encomenda') {
      sendOrderEmail_({
        id: id,
        timestamp: timestamp,
        tipo: tipo,
        medicamento: row[3],
        prePago: row[4],
        cliente: row[5],
        atendente: row[6],
        previsaoEntrega: row[7],
      });
    }
  }

  return {
    success: true,
    id: id,
    items: fetchData(),
  };
}

function fetchData() {
  setupSpreadsheet();

  return {
    geral: fetchSheetItems_(SHEET_NAMES.GERAL).filter(function (item) {
      return !item.Resolvido;
    }),
    medicamentos: fetchSheetItems_(SHEET_NAMES.MEDICAMENTOS),
  };
}

function markAsPurchased(id) {
  setupSpreadsheet();

  const location = findRowById_(SHEET_NAMES.MEDICAMENTOS, id);
  if (!location) {
    throw new Error('Medicamento nao encontrado: ' + id);
  }

  const compradoColumn = getColumnIndex_(location.sheet, 'Comprado');
  location.sheet.getRange(location.rowNumber, compradoColumn).setValue(true);
  syncMedicationStatus_(location.sheet, location.rowNumber);

  return {
    success: true,
    items: fetchData(),
  };
}

function markAsDelivered(id) {
  setupSpreadsheet();

  const location = findRowById_(SHEET_NAMES.MEDICAMENTOS, id);
  if (!location) {
    throw new Error('Medicamento nao encontrado: ' + id);
  }

  const compradoColumn = getColumnIndex_(location.sheet, 'Comprado');
  const entregueColumn = getColumnIndex_(location.sheet, 'Entregue');
  location.sheet.getRange(location.rowNumber, compradoColumn).setValue(true);
  location.sheet.getRange(location.rowNumber, entregueColumn).setValue(true);
  syncMedicationStatus_(location.sheet, location.rowNumber);

  return {
    success: true,
    items: fetchData(),
  };
}

function markAsResolved(id) {
  setupSpreadsheet();

  const location = findRowById_(SHEET_NAMES.GERAL, id);
  if (!location) {
    throw new Error('Solicitacao geral nao encontrada: ' + id);
  }

  const resolvidoColumn = getColumnIndex_(location.sheet, 'Resolvido');
  location.sheet.getRange(location.rowNumber, resolvidoColumn).setValue(true);
  moveRowToResolved(SHEET_NAMES.GERAL, location.rowNumber);

  return {
    success: true,
    items: fetchData(),
  };
}

function moveRowToResolved(sheetName, rowNumber) {
  setupSpreadsheet();

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName(sheetName);
  const archiveSheet = ss.getSheetByName(SHEET_NAMES.ARQUIVO);

  if (!sourceSheet) {
    throw new Error('Aba de origem nao encontrada: ' + sheetName);
  }

  if (rowNumber <= 1 || rowNumber > sourceSheet.getLastRow()) {
    throw new Error('Linha invalida para arquivamento: ' + rowNumber);
  }

  const sourceHeaders = getHeaders_(sourceSheet);
  const sourceValues = sourceSheet.getRange(rowNumber, 1, 1, sourceHeaders.length).getValues()[0];
  const sourceObject = rowToObject_(sourceHeaders, sourceValues);
  const archiveRow = buildArchiveRow_(sheetName, sourceObject);

  archiveSheet.appendRow(archiveRow);
  sourceSheet.deleteRow(rowNumber);

  return true;
}

function onEdit(e) {
  if (!e || !e.range) {
    return;
  }

  const sheet = e.range.getSheet();
  const sheetName = sheet.getName();
  const rowNumber = e.range.getRow();

  if (rowNumber <= 1) {
    return;
  }

  if (sheetName === SHEET_NAMES.GERAL) {
    const resolvidoColumn = getColumnIndex_(sheet, 'Resolvido');
    if (e.range.getColumn() === resolvidoColumn && toBoolean_(e.value)) {
      moveRowToResolved(sheetName, rowNumber);
    }
  }

  if (sheetName === SHEET_NAMES.MEDICAMENTOS) {
    const compradoColumn = getColumnIndex_(sheet, 'Comprado');
    const entregueColumn = getColumnIndex_(sheet, 'Entregue');
    if (e.range.getColumn() === compradoColumn || e.range.getColumn() === entregueColumn) {
      syncMedicationStatus_(sheet, rowNumber);
    }
  }
}

function populateTestData() {
  setupSpreadsheet();

  saveData(SHEET_NAMES.GERAL, {
    autor: 'Maria',
    descricao: 'Conferir divergencia no caixa do turno da tarde.',
  });

  saveData(SHEET_NAMES.MEDICAMENTOS, {
    tipo: 'Encomenda',
    medicamento: 'Losartana 50mg',
    prePago: true,
    cliente: 'Joao Silva',
    telefone: '(11) 91234-5678',
    atendente: 'Ana',
    previsaoEntrega: formatDateForInput_(new Date()),
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  saveData(SHEET_NAMES.MEDICAMENTOS, {
    tipo: 'Falta',
    medicamento: 'Dipirona gotas',
    prePago: false,
    cliente: 'Estoque loja',
    telefone: '(11) 3333-4444',
    atendente: 'Carlos',
    previsaoEntrega: formatDateForInput_(tomorrow),
  });
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function fetchSheetItems_(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return [];
  }

  const headers = getHeaders_(sheet);
  const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();

  return values.map(function (row) {
    const item = rowToObject_(headers, row);
    item.Origem = sheetName;
    normalizeItemForClient_(item);
    return item;
  });
}

function ensureHeaders_(sheet, expectedHeaders) {
  const targetColumns = Math.max(sheet.getLastColumn(), expectedHeaders.length, 1);
  const rawHeaders = sheet.getRange(1, 1, 1, targetColumns).getValues()[0];
  const currentHeaders = trimTrailingEmpty_(rawHeaders.map(function (value) {
    return String(value || '').trim();
  }));
  const hasDataRows = sheet.getLastRow() > 1;
  const expectedNormalized = expectedHeaders.map(normalizeHeaderName_);
  const currentNormalized = currentHeaders.map(normalizeHeaderName_);

  if (currentHeaders.length === 0) {
    writeHeaderRow_(sheet, expectedHeaders, targetColumns);
    return;
  }

  const exactNormalizedMatch =
    currentNormalized.length === expectedNormalized.length &&
    currentNormalized.every(function (value, index) {
      return value === expectedNormalized[index];
    });

  const isExpectedPrefix =
    currentNormalized.length < expectedNormalized.length &&
    currentNormalized.every(function (value, index) {
      return value === expectedNormalized[index];
    });

  if (exactNormalizedMatch || isExpectedPrefix || !hasDataRows) {
    writeHeaderRow_(sheet, expectedHeaders, targetColumns);
    return;
  }

  throw new Error(
    'Estrutura de cabecalho incompativel na aba "' +
      sheet.getName() +
      '". Ajuste manualmente os cabecalhos para: ' +
      expectedHeaders.join(', ') +
      '.'
  );
}

function getHeaders_(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].filter(String);
}

function rowToObject_(headers, row) {
  return headers.reduce(function (object, header, index) {
    object[header] = row[index];
    return object;
  }, {});
}

function buildArchiveRow_(sheetName, item) {
  const archiveObject = {
    Origem: sheetName,
    ID: item.ID || '',
    Timestamp: item.Timestamp || '',
    Tipo: item.Tipo || '',
    Autor: item.Autor || '',
    Descricao: item.Descricao || '',
    Medicamento: item.Medicamento || '',
    Pre_Pago: item.Pre_Pago || false,
    Cliente: item.Cliente || '',
    Atendente: item.Atendente || '',
    Previsao_Entrega: item.Previsao_Entrega || '',
    Comprado: item.Comprado || false,
    Resolvido: item.Resolvido || false,
    Entregue: item.Entregue || false,
    Telefone: item.Telefone || '',
    Status: item.Status || '',
    Status_Aviso_WhatsApp: item.Status_Aviso_WhatsApp || '',
    Data_Aviso_WhatsApp: item.Data_Aviso_WhatsApp || '',
    Arquivado_Em: new Date(),
  };

  return HEADERS.Arquivo_Resolvidos.map(function (header) {
    return archiveObject[header];
  });
}

function findRowById_(sheetName, id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return null;
  }

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();

  for (var index = 0; index < ids.length; index++) {
    if (ids[index][0] === id) {
      return {
        sheet: sheet,
        rowNumber: index + 2,
      };
    }
  }

  return null;
}

function getColumnIndex_(sheet, headerName) {
  const headers = getHeaders_(sheet);
  const index = headers.indexOf(headerName);

  if (index === -1) {
    throw new Error('Coluna nao encontrada: ' + headerName);
  }

  return index + 1;
}

function normalizeItemForClient_(item) {
  Object.keys(item).forEach(function (key) {
    if (item[key] instanceof Date) {
      item[key] = Utilities.formatDate(
        item[key],
        Session.getScriptTimeZone(),
        key === 'Previsao_Entrega' ? 'yyyy-MM-dd' : "yyyy-MM-dd'T'HH:mm:ss"
      );
    }
  });

  item.Pre_Pago = toBoolean_(item.Pre_Pago);
  item.Comprado = toBoolean_(item.Comprado);
  item.Resolvido = toBoolean_(item.Resolvido);
  item.Entregue = toBoolean_(item.Entregue);
  item.Telefone = sanitizeText_(item.Telefone);
  item.Status = sanitizeText_(item.Status) || deriveMedicationStatus_(item);
  item.Status_Aviso_WhatsApp = sanitizeText_(item.Status_Aviso_WhatsApp);
}

function parseDate_(value) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return null;
  }

  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      return null;
    }
    const cloned = new Date(value.getTime());
    cloned.setHours(0, 0, 0, 0);
    return cloned;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).trim());
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

function formatDateForInput_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function sanitizeText_(value) {
  return String(value || '').trim();
}

function toBoolean_(value) {
  return value === true || value === 'TRUE' || value === 'true' || value === 'Sim' || value === 'on';
}

function sendOrderEmail_(order) {
  const hasValidPrevisao =
    order.previsaoEntrega instanceof Date && !isNaN(order.previsaoEntrega.getTime());
  const previsao = hasValidPrevisao
    ? Utilities.formatDate(order.previsaoEntrega, Session.getScriptTimeZone(), 'dd/MM/yyyy')
    : 'Nao informada';

  const subject = 'Nova encomenda de medicamento - ' + order.medicamento;
  const body = [
    'Uma nova encomenda de medicamento foi cadastrada.',
    '',
    'ID: ' + order.id,
    'Medicamento: ' + order.medicamento,
    'Cliente: ' + order.cliente,
    'Atendente: ' + order.atendente,
    'Pre-pago: ' + (order.prePago ? 'Sim' : 'Nao'),
    'Previsao de entrega: ' + previsao,
    '',
    'Este email e enviado apenas para registros com Tipo = Encomenda.',
  ].join('\n');

  MailApp.sendEmail(EMAIL_ENCOMENDAS, subject, body);
}

function registerWhatsAppAttempt(id) {
  setupSpreadsheet();

  const location = findRowById_(SHEET_NAMES.MEDICAMENTOS, id);
  if (!location) {
    throw new Error('Medicamento nao encontrado para aviso no WhatsApp: ' + id);
  }

  const sheet = location.sheet;
  const headers = getHeaders_(sheet);
  const rowValues = sheet.getRange(location.rowNumber, 1, 1, headers.length).getValues()[0];
  const item = rowToObject_(headers, rowValues);
  normalizeItemForClient_(item);

  if (!canShowWhatsAppButton_(item)) {
    throw new Error(
      'O aviso no WhatsApp so pode ser usado quando o item estiver Comprado, Entregue ou Resolvido parcialmente.'
    );
  }

  const normalizedPhone = normalizeBrazilPhone_(item.Telefone);
  if (!normalizedPhone) {
    throw new Error(
      'Telefone do cliente vazio ou invalido. Informe DDD + numero, com ou sem mascara.'
    );
  }

  const statusAvisoColumn = getColumnIndex_(sheet, 'Status_Aviso_WhatsApp');
  const dataAvisoColumn = getColumnIndex_(sheet, 'Data_Aviso_WhatsApp');
  const message = buildWhatsAppMessage_(item.Cliente, item.Medicamento);

  sheet.getRange(location.rowNumber, statusAvisoColumn).setValue('Tentativa registrada');
  sheet.getRange(location.rowNumber, dataAvisoColumn).setValue(new Date());

  return {
    success: true,
    whatsAppUrl: 'https://wa.me/' + normalizedPhone + '?text=' + encodeURIComponent(message),
    items: fetchData(),
  };
}

function syncMedicationStatus_(sheet, rowNumber) {
  const compradoColumn = getColumnIndex_(sheet, 'Comprado');
  const entregueColumn = getColumnIndex_(sheet, 'Entregue');
  const statusColumn = getColumnIndex_(sheet, 'Status');
  const comprado = toBoolean_(sheet.getRange(rowNumber, compradoColumn).getValue());
  const entregue = toBoolean_(sheet.getRange(rowNumber, entregueColumn).getValue());

  let status = 'Pendente';
  if (entregue) {
    status = 'Entregue';
  } else if (comprado) {
    status = 'Comprado';
  }

  sheet.getRange(rowNumber, statusColumn).setValue(status);
}

function deriveMedicationStatus_(item) {
  if (toBoolean_(item.Entregue)) {
    return 'Entregue';
  }
  if (toBoolean_(item.Comprado)) {
    return 'Comprado';
  }
  return 'Pendente';
}

function canShowWhatsAppButton_(item) {
  const status = sanitizeText_(item.Status).toLowerCase();
  return toBoolean_(item.Comprado) || toBoolean_(item.Entregue) || status === 'resolvido parcialmente';
}

function normalizeBrazilPhone_(phoneValue) {
  const digits = String(phoneValue || '')
    .replace(/\D/g, '')
    .replace(/^0+/, '');

  if (!digits) {
    return '';
  }

  if (digits.indexOf('55') === 0) {
    return digits.length === 12 || digits.length === 13 ? digits : '';
  }

  return digits.length === 10 || digits.length === 11 ? '55' + digits : '';
}

function buildWhatsAppMessage_(clientName, medicineName) {
  const name = sanitizeText_(clientName) || 'cliente';
  const medicine = sanitizeText_(medicineName) || 'informado';

  return [
    'Olá, ' + name + '. Seu medicamento ' + medicine + ' chegou na Drogarias Conceito.',
    '',
    'Pode retirar na loja hoje.',
    '',
    'Se preferir, responda esta mensagem que verificamos a melhor forma de entrega.',
  ].join('\n');
}

function writeHeaderRow_(sheet, expectedHeaders, targetColumns) {
  const totalColumns = Math.max(targetColumns, expectedHeaders.length, 1);
  const values = new Array(totalColumns).fill('');

  expectedHeaders.forEach(function (header, index) {
    values[index] = header;
  });

  sheet.getRange(1, 1, 1, totalColumns).setValues([values]);
  sheet.setFrozenRows(1);
}

function trimTrailingEmpty_(values) {
  const copy = values.slice();
  while (copy.length > 0 && !copy[copy.length - 1]) {
    copy.pop();
  }
  return copy;
}

function normalizeHeaderName_(header) {
  return String(header || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}
