const SHEET_NAMES = {
  GERAL: 'Geral',
  MEDICAMENTOS: 'Medicamentos',
  ARQUIVO: 'Arquivo_Resolvidos',
  CHECKLIST: 'Checklist_Turnos',
};

const EMAIL_ENCOMENDAS = 'drogariasconceitocm@gmail.com';
const HANDOVER_SPREADSHEET_ID_KEY = 'HANDOVER_SPREADSHEET_ID';
const HANDOVER_SPREADSHEET_TITLE = 'Handover Drogarias Conceito';
const HANDOVER_TIMEZONE = 'America/Sao_Paulo';

const CHECKLIST_TURNO_MANHA = 'Manhã';
const CHECKLIST_HORARIO_REFERENCIA = '07:00';
const CHECKLIST_ALERT_HHMM = '07:30';

const CHECKLIST_STATUS = {
  PENDENTE: 'Pendente',
  FEITO: 'Feito',
  NA: 'Não aplicável',
};

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
    'Preco_Venda',
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
    'Preco_Venda',
  ],
  Checklist_Turnos: [
    'ID',
    'Data',
    'Turno',
    'Horario_Referencia',
    'Categoria',
    'Item',
    'Descricao',
    'Status',
    'Responsavel',
    'Data_Hora_Check',
    'Observacao',
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

function getSpreadsheet_() {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = sanitizeText_(properties.getProperty(HANDOVER_SPREADSHEET_ID_KEY));

  if (spreadsheetId) {
    try {
      return SpreadsheetApp.openById(spreadsheetId);
    } catch (error) {
      throw new Error(
        'Nao foi possivel abrir a planilha configurada em ' +
          HANDOVER_SPREADSHEET_ID_KEY +
          ' (' +
          spreadsheetId +
          '). Verifique o ID e as permissoes da conta.'
      );
    }
  }

  try {
    const spreadsheet = SpreadsheetApp.create(HANDOVER_SPREADSHEET_TITLE);
    properties.setProperty(HANDOVER_SPREADSHEET_ID_KEY, spreadsheet.getId());
    return spreadsheet;
  } catch (error) {
    throw new Error(
      'Nao foi possivel criar a planilha do Handover automaticamente. Configure a propriedade ' +
        HANDOVER_SPREADSHEET_ID_KEY +
        ' com um ID valido.'
    );
  }
}

function getSpreadsheetIdForDebug() {
  const spreadsheet = getSpreadsheet_();
  const spreadsheetId = spreadsheet.getId();
  Logger.log('HANDOVER_SPREADSHEET_ID em uso: ' + spreadsheetId);
  return spreadsheetId;
}

function setupSpreadsheet() {
  const ss = getSpreadsheet_();

  Object.keys(HEADERS).forEach(function (sheetName) {
    const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    ensureHeaders_(sheet, HEADERS[sheetName]);
  });
}

function getChecklistTemplate_() {
  return [
    {
      categoria: 'Estrutura e Ambiente',
      item: 'Climatização',
      descricao: 'Ligar ar-condicionado e cortina de ar',
    },
    {
      categoria: 'Estrutura e Ambiente',
      item: 'Iluminação',
      descricao: 'Acender luzes do salão, fachada e tótens',
    },
    {
      categoria: 'Estrutura e Ambiente',
      item: 'Som ambiente',
      descricao: 'Ligar rádio interna em volume agradável',
    },
    {
      categoria: 'Estrutura e Ambiente',
      item: 'Fachada',
      descricao: 'Verificar limpeza da calçada e se há obstruções na entrada',
    },
    {
      categoria: 'Sistemas e Operação',
      item: 'Servidor',
      descricao: 'Ligar e verificar se o banco de dados carregou corretamente',
    },
    {
      categoria: 'Sistemas e Operação',
      item: 'PDVs e Balcão',
      descricao: 'Ligar computadores, monitores e impressoras térmicas',
    },
    {
      categoria: 'Sistemas e Operação',
      item: 'Troco',
      descricao: 'Conferir o kit de troco',
    },
    {
      categoria: 'Sistemas e Operação',
      item: 'Caixa',
      descricao: 'Abrir e conferir',
    },
    {
      categoria: 'Sistemas e Operação',
      item: 'Handover',
      descricao:
        'Checar mensagens do turno anterior, limpar o que foi resolvido e programar entregas do dia de medicamentos encomendados',
    },
    {
      categoria: 'Sistemas e Operação',
      item: 'Internet e TEF',
      descricao: 'Testar conexão e máquinas de cartão',
    },
    {
      categoria: 'Sistemas e Operação',
      item: 'Telefones/WhatsApp',
      descricao: 'Verificar bateria, conexão e mensagens recebidas enquanto a loja estava fechada',
    },
    {
      categoria: 'Higiene e Organização',
      item: 'Pisos e Prateleiras',
      descricao: 'Conferir limpeza geral, sem pó ou manchas',
    },
    {
      categoria: 'Higiene e Organização',
      item: 'Lixeiras',
      descricao: 'Verificar se todas estão com sacos novos',
    },
    {
      categoria: 'Higiene e Organização',
      item: 'Banheiros e Pias',
      descricao: 'Repor sabonete líquido e papel toalha',
    },
    {
      categoria: 'Higiene e Organização',
      item: 'Álcool em gel',
      descricao: 'Verificar disponibilidade no balcão',
    },
    {
      categoria: 'Logística de Entrega',
      item: 'Moto',
      descricao: 'Usar sistema para conferir condições da moto junto com entregador',
    },
    {
      categoria: 'Logística de Entrega',
      item: 'Baú/Mochila',
      descricao: 'Verificar limpeza interna e se está seco',
    },
    {
      categoria: 'Logística de Entrega',
      item: 'Maquineta móvel',
      descricao: 'Checar bateria da máquina de cartão de rua',
    },
    {
      categoria: 'Balcão e Medicamentos',
      item: 'Termolábeis',
      descricao: 'Conferir e anotar temperatura da geladeira de vacinas/insulinas',
    },
    {
      categoria: 'Balcão e Medicamentos',
      item: 'Psicotrópicos',
      descricao: 'Verificar se armário controlado está fechado e chave acessível',
    },
    {
      categoria: 'Balcão e Medicamentos',
      item: 'Reposição',
      descricao: 'Verificar buracos nas prateleiras de curva A para abastecimento imediato',
    },
  ];
}

function getChecklistDateKey_(date) {
  return Utilities.formatDate(date || new Date(), HANDOVER_TIMEZONE, 'yyyy-MM-dd');
}

function getChecklistTemplateOrderMap_() {
  return getChecklistTemplate_().reduce(function (orderMap, checklistItem, index) {
    orderMap[buildChecklistIdentityKey_(checklistItem.item)] = index;
    return orderMap;
  }, {});
}

function ensureTodayMorningChecklist_() {
  const ss = getSpreadsheet_();
  const sheet = getSheetOrThrow_(ss, SHEET_NAMES.CHECKLIST);
  const headers = getHeaders_(sheet);
  const template = getChecklistTemplate_();
  const dateKey = getChecklistDateKey_();
  const turno = CHECKLIST_TURNO_MANHA;
  const identityPrefix = buildChecklistIdentityKey_(dateKey) + '|' + buildChecklistIdentityKey_(turno);

  const existingKeys = new Set();
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
    values.forEach(function (row) {
      const rowObject = rowToObject_(headers, row);
      const rowDate = normalizeDateKeyCell_(rowObject.Data);
      const rowTurno = sanitizeText_(rowObject.Turno);
      const rowItem = sanitizeText_(rowObject.Item);
      if (!rowDate || !rowTurno || !rowItem) {
        return;
      }

      const rowKey =
        buildChecklistIdentityKey_(rowDate) +
        '|' +
        buildChecklistIdentityKey_(rowTurno) +
        '|' +
        buildChecklistIdentityKey_(rowItem);
      existingKeys.add(rowKey);
    });
  }

  const rowsToInsert = [];
  template.forEach(function (templateItem) {
    const itemKey =
      identityPrefix + '|' + buildChecklistIdentityKey_(sanitizeText_(templateItem.item));
    if (existingKeys.has(itemKey)) {
      return;
    }

    rowsToInsert.push([
      Utilities.getUuid(),
      dateKey,
      turno,
      CHECKLIST_HORARIO_REFERENCIA,
      sanitizeText_(templateItem.categoria),
      sanitizeText_(templateItem.item),
      sanitizeText_(templateItem.descricao),
      CHECKLIST_STATUS.PENDENTE,
      '',
      '',
      '',
    ]);
  });

  if (rowsToInsert.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rowsToInsert.length, headers.length).setValues(rowsToInsert);
  }

  return {
    dateKey: dateKey,
    turno: turno,
    insertedCount: rowsToInsert.length,
  };
}

function fetchChecklistItems_(dateKey, turno) {
  const ss = getSpreadsheet_();
  const sheet = getSheetOrThrow_(ss, SHEET_NAMES.CHECKLIST);
  const headers = getHeaders_(sheet);
  const filterDateKey = dateKey || getChecklistDateKey_();
  const filterTurno = turno || CHECKLIST_TURNO_MANHA;

  if (sheet.getLastRow() <= 1) {
    return [];
  }

  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
  const orderMap = getChecklistTemplateOrderMap_();

  return values
    .map(function (row) {
      const item = rowToObject_(headers, row);
      normalizeChecklistItemForClient_(item);
      return item;
    })
    .filter(function (item) {
      return item.Data === filterDateKey && item.Turno === filterTurno;
    })
    .sort(function (a, b) {
      const orderA = orderMap[buildChecklistIdentityKey_(a.Item)];
      const orderB = orderMap[buildChecklistIdentityKey_(b.Item)];
      const safeA = typeof orderA === 'number' ? orderA : Number.MAX_SAFE_INTEGER;
      const safeB = typeof orderB === 'number' ? orderB : Number.MAX_SAFE_INTEGER;
      if (safeA !== safeB) {
        return safeA - safeB;
      }
      return String(a.Item).localeCompare(String(b.Item));
    });
}

function getChecklistSummary_(items) {
  const totalItens = items.length;
  const itensFeitos = items.filter(function (item) {
    return item.Status === CHECKLIST_STATUS.FEITO;
  }).length;
  const itensNaoAplicaveis = items.filter(function (item) {
    return item.Status === CHECKLIST_STATUS.NA;
  }).length;
  const itensPendentes = items.filter(function (item) {
    return item.Status === CHECKLIST_STATUS.PENDENTE;
  }).length;
  const concluidos = itensFeitos + itensNaoAplicaveis;
  const percentualConcluido = totalItens > 0 ? Math.round((concluidos / totalItens) * 100) : 0;

  return {
    totalItens: totalItens,
    itensFeitos: itensFeitos,
    itensNaoAplicaveis: itensNaoAplicaveis,
    itensPendentes: itensPendentes,
    percentualConcluido: percentualConcluido,
  };
}

function updateChecklistItemStatus(id, status, responsavel) {
  setupSpreadsheet();

  const location = findRowById_(SHEET_NAMES.CHECKLIST, id);
  if (!location) {
    throw new Error('Item de checklist nao encontrado: ' + id);
  }

  const normalizedStatus = parseChecklistStatusInput_(status);
  const responsavelValue = sanitizeText_(responsavel);
  const statusColumn = getColumnIndex_(location.sheet, 'Status');
  const dataHoraCheckColumn = getColumnIndex_(location.sheet, 'Data_Hora_Check');
  const responsavelColumn = getColumnIndex_(location.sheet, 'Responsavel');

  location.sheet.getRange(location.rowNumber, statusColumn).setValue(normalizedStatus);
  location.sheet
    .getRange(location.rowNumber, dataHoraCheckColumn)
    .setValue(normalizedStatus === CHECKLIST_STATUS.PENDENTE ? '' : new Date());
  location.sheet.getRange(location.rowNumber, responsavelColumn).setValue(responsavelValue);

  return {
    success: true,
    items: fetchData(),
  };
}

function updateChecklistItemObservation(id, observacao, responsavel) {
  setupSpreadsheet();

  const location = findRowById_(SHEET_NAMES.CHECKLIST, id);
  if (!location) {
    throw new Error('Item de checklist nao encontrado: ' + id);
  }

  const observacaoColumn = getColumnIndex_(location.sheet, 'Observacao');
  const responsavelColumn = getColumnIndex_(location.sheet, 'Responsavel');

  location.sheet.getRange(location.rowNumber, observacaoColumn).setValue(sanitizeText_(observacao));
  location.sheet
    .getRange(location.rowNumber, responsavelColumn)
    .setValue(sanitizeText_(responsavel));

  return {
    success: true,
    items: fetchData(),
  };
}

function generateTodayMorningChecklist() {
  setupSpreadsheet();
  ensureTodayMorningChecklist_();
  return {
    success: true,
    items: fetchData(),
  };
}

function saveData(tab, data) {
  setupSpreadsheet();

  if (tab !== SHEET_NAMES.GERAL && tab !== SHEET_NAMES.MEDICAMENTOS) {
    throw new Error('Aba invalida: ' + tab);
  }

  const ss = getSpreadsheet_();
  const sheet = getSheetOrThrow_(ss, tab);
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
    const precoVenda = parseSalePrice_(data.precoVenda);
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
      precoVenda,
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
  const checklistContext = ensureTodayMorningChecklist_();
  const checklistItems = fetchChecklistItems_(checklistContext.dateKey, checklistContext.turno);

  return {
    geral: fetchSheetItems_(SHEET_NAMES.GERAL).filter(function (item) {
      return !item.Resolvido;
    }),
    medicamentos: fetchSheetItems_(SHEET_NAMES.MEDICAMENTOS),
    checklistTurno: {
      data: checklistContext.dateKey,
      turno: checklistContext.turno,
      horarioReferencia: CHECKLIST_HORARIO_REFERENCIA,
      isAfterDeadline: isAfterMorningDeadline_(checklistContext.dateKey),
      items: checklistItems,
      summary: getChecklistSummary_(checklistItems),
    },
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

  const ss = getSpreadsheet_();
  const sourceSheet = getSheetOrThrow_(ss, sheetName);
  const archiveSheet = getSheetOrThrow_(ss, SHEET_NAMES.ARQUIVO);

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
  const officialSpreadsheet = getSpreadsheet_();
  if (sheet.getParent().getId() !== officialSpreadsheet.getId()) {
    return;
  }

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

  if (sheetName === SHEET_NAMES.CHECKLIST) {
    const statusColumn = getColumnIndex_(sheet, 'Status');
    if (e.range.getColumn() === statusColumn) {
      const normalizedStatus = normalizeChecklistStatus_(e.value);
      const dataHoraCheckColumn = getColumnIndex_(sheet, 'Data_Hora_Check');
      sheet.getRange(rowNumber, statusColumn).setValue(normalizedStatus);
      sheet
        .getRange(rowNumber, dataHoraCheckColumn)
        .setValue(normalizedStatus === CHECKLIST_STATUS.PENDENTE ? '' : new Date());
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
  const sheet = getSheetOrThrow_(getSpreadsheet_(), sheetName);
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
    Preco_Venda:
      item.Preco_Venda === '' || item.Preco_Venda === null || item.Preco_Venda === undefined
        ? ''
        : item.Preco_Venda,
  };

  return HEADERS.Arquivo_Resolvidos.map(function (header) {
    return archiveObject[header];
  });
}

function findRowById_(sheetName, id) {
  const sheet = getSheetOrThrow_(getSpreadsheet_(), sheetName);
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

function getSheetOrThrow_(spreadsheet, sheetName) {
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error(
      'Aba obrigatoria nao encontrada na planilha ' + spreadsheet.getId() + ': ' + sheetName
    );
  }
  return sheet;
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
  item.Preco_Venda = normalizeSalePriceForClient_(item.Preco_Venda);
}

function normalizeChecklistItemForClient_(item) {
  if (item.Data_Hora_Check instanceof Date) {
    item.Data_Hora_Check = Utilities.formatDate(
      item.Data_Hora_Check,
      HANDOVER_TIMEZONE,
      "yyyy-MM-dd'T'HH:mm:ss"
    );
  }

  item.Data = normalizeDateKeyCell_(item.Data);
  item.Turno = sanitizeText_(item.Turno) || CHECKLIST_TURNO_MANHA;
  item.Horario_Referencia = sanitizeText_(item.Horario_Referencia) || CHECKLIST_HORARIO_REFERENCIA;
  item.Categoria = sanitizeText_(item.Categoria);
  item.Item = sanitizeText_(item.Item);
  item.Descricao = sanitizeText_(item.Descricao);
  item.Status = normalizeChecklistStatus_(item.Status);
  item.Responsavel = sanitizeText_(item.Responsavel);
  item.Observacao = sanitizeText_(item.Observacao);
}

function parseChecklistStatusInput_(status) {
  const normalized = buildChecklistIdentityKey_(status);
  if (normalized === buildChecklistIdentityKey_(CHECKLIST_STATUS.PENDENTE)) {
    return CHECKLIST_STATUS.PENDENTE;
  }
  if (normalized === buildChecklistIdentityKey_(CHECKLIST_STATUS.FEITO)) {
    return CHECKLIST_STATUS.FEITO;
  }
  if (
    normalized === buildChecklistIdentityKey_(CHECKLIST_STATUS.NA) ||
    normalized === 'na' ||
    normalized === 'n/a'
  ) {
    return CHECKLIST_STATUS.NA;
  }

  throw new Error(
    'Status invalido para checklist. Use apenas: ' +
      CHECKLIST_STATUS.PENDENTE +
      ', ' +
      CHECKLIST_STATUS.FEITO +
      ' ou ' +
      CHECKLIST_STATUS.NA +
      '.'
  );
}

function normalizeChecklistStatus_(status) {
  try {
    return parseChecklistStatusInput_(status);
  } catch (error) {
    return CHECKLIST_STATUS.PENDENTE;
  }
}

function normalizeDateKeyCell_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, HANDOVER_TIMEZONE, 'yyyy-MM-dd');
  }

  const textValue = sanitizeText_(value);
  if (!textValue) {
    return '';
  }

  const parsed = parseDate_(textValue);
  if (!parsed) {
    return '';
  }

  return Utilities.formatDate(parsed, HANDOVER_TIMEZONE, 'yyyy-MM-dd');
}

function isAfterMorningDeadline_(dateKey) {
  const currentDateKey = getChecklistDateKey_();
  if (dateKey < currentDateKey) {
    return true;
  }
  if (dateKey > currentDateKey) {
    return false;
  }

  const hhmmNow = Utilities.formatDate(new Date(), HANDOVER_TIMEZONE, 'HH:mm');
  return hhmmNow >= CHECKLIST_ALERT_HHMM;
}

function buildChecklistIdentityKey_(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
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

function parseSalePrice_(value) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return '';
  }

  if (typeof value === 'number') {
    if (isNaN(value)) {
      throw new Error('Preco de venda invalido. Informe um valor numerico valido.');
    }
    if (value < 0) {
      throw new Error('Preco de venda nao pode ser negativo.');
    }
    return roundCurrency_(value);
  }

  let normalized = String(value).trim();
  normalized = normalized.replace(/\s/g, '').replace(/^R\$/i, '');

  if (!normalized) {
    return '';
  }

  if (normalized.indexOf('-') === 0) {
    throw new Error('Preco de venda nao pode ser negativo.');
  }

  if (normalized.indexOf(',') >= 0 && normalized.indexOf('.') >= 0) {
    normalized = normalized.replace(/\./g, '').replace(',', '.');
  } else if (normalized.indexOf(',') >= 0) {
    normalized = normalized.replace(',', '.');
  }

  const parsed = Number(normalized);
  if (isNaN(parsed)) {
    throw new Error('Preco de venda invalido. Informe um valor numerico valido.');
  }
  if (parsed < 0) {
    throw new Error('Preco de venda nao pode ser negativo.');
  }

  return roundCurrency_(parsed);
}

function normalizeSalePriceForClient_(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  if (typeof value === 'number') {
    if (isNaN(value)) {
      return '';
    }
    return roundCurrency_(value);
  }

  try {
    const parsed = parseSalePrice_(value);
    return parsed === '' ? '' : parsed;
  } catch (error) {
    return sanitizeText_(value);
  }
}

function roundCurrency_(value) {
  return Math.round(Number(value) * 100) / 100;
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
