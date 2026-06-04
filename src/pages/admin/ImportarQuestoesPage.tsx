import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../theme/ThemeContext'
import { useIsMobile } from '../../hooks/useIsMobile'
import { importFromNotebooklm } from '../../api/importApi'
import type { ImportNotebooklmPayload } from '../../api/importApi'
import { BoldBtn } from '../../components/ui/BoldBtn'
import { I } from '../../components/ui/icons'

export function ImportarQuestoesPage() {
  const { T } = useTheme()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [parsedPayload, setParsedPayload] = useState<ImportNotebooklmPayload | null>(null)
  const [parseError, setParseError] = useState('')
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState('')
  const [importResult, setImportResult] = useState<{
    materia: string
    imported: number
    skipped: number
    details: { imported: string[]; skipped: string[] }
  } | null>(null)

  function handleFileChange(e: import('react').ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    setParseError('')
    setImportError('')
    setImportResult(null)
    setParsedPayload(null)
    setSelectedFile(file)

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string) as ImportNotebooklmPayload
        setParsedPayload(json)
      } catch {
        setParseError('Arquivo inválido. Verifique se é um JSON bem formado.')
        setSelectedFile(null)
      }
    }
    reader.readAsText(file)
  }

  function handleClear() {
    setSelectedFile(null)
    setParsedPayload(null)
    setParseError('')
    setImportError('')
    setImportResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleImport() {
    if (!parsedPayload) return
    setImporting(true)
    setImportError('')
    try {
      const result = await importFromNotebooklm(parsedPayload)
      setImportResult(result)
      handleClear()
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Erro ao importar questões.')
    } finally {
      setImporting(false)
    }
  }

  const questionsCount = parsedPayload?.questions?.length ?? 0

  return (
    <div style={{ padding: isMobile ? '16px 16px 40px' : '28px 32px 48px', maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: `${T.ai}18`, color: T.ai, letterSpacing: 0.4, textTransform: 'uppercase' }}>Admin</span>
        <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, letterSpacing: -0.6, color: T.text, margin: '8px 0 4px' }}>Importar questões</h1>
        <p style={{ color: T.textDim, fontSize: 14, margin: 0 }}>Importe questões para o banco a partir de um arquivo JSON do NotebookLM</p>
      </div>

      {/* Format reference */}
      <div style={{ padding: 18, background: T.aiBg, border: `1px solid ${T.aiBorder}`, borderRadius: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <I.Doc size={15} stroke={1.8} style={{ color: T.ai }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: T.ai }}>Formato esperado do arquivo</span>
        </div>
        <pre style={{ margin: 0, fontSize: isMobile ? 11 : 12, color: T.textDim, lineHeight: 1.6, fontFamily: 'ui-monospace, monospace', background: T.surfaceAlt, padding: '10px 12px', borderRadius: 10, overflow: 'auto' }}>{`{
  "subject": "História",    // nome exato da matéria cadastrada
  "level": "medio",         // facil | medio | dificil
  "questions": [
    {
      "index": 1,
      "question": "Enunciado?",
      "alternatives": [
        { "label": "A", "text": "...", "isCorrect": false },
        { "label": "B", "text": "...", "isCorrect": true }
      ]
    }
  ]
}`}</pre>
        <div style={{ marginTop: 8, fontSize: 12, color: T.textMute }}>
          Questões já existentes na mesma matéria são ignoradas (sem duplicatas).
        </div>
      </div>

      {/* Success result */}
      {importResult && (
        <div style={{ padding: 20, background: `${T.success}10`, border: `1px solid ${T.success}30`, borderRadius: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <I.Check size={16} stroke={2.5} style={{ color: T.success }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: T.success }}>Importação concluída — {importResult.materia}</span>
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 13, color: T.textDim, flexWrap: 'wrap' }}>
            <span><strong style={{ color: T.text }}>{importResult.imported}</strong> questão(ões) criada(s)</span>
            <span><strong style={{ color: T.text }}>{importResult.skipped}</strong> duplicata(s) ignorada(s)</span>
          </div>
          {importResult.details.imported.length > 0 && (
            <details style={{ marginTop: 12 }}>
              <summary style={{ fontSize: 12, color: T.textMute, cursor: 'pointer', userSelect: 'none' }}>
                Ver questões criadas ({importResult.details.imported.length})
              </summary>
              <ul style={{ margin: '8px 0 0', padding: '0 0 0 16px', fontSize: 12, color: T.textDim, lineHeight: 1.7 }}>
                {importResult.details.imported.map((s, i) => <li key={i}>{s}…</li>)}
              </ul>
            </details>
          )}
        </div>
      )}

      {/* Upload area */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="json-upload"
        />

        {!selectedFile ? (
          /* Drop zone */
          <label
            htmlFor="json-upload"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: '48px 24px',
              border: `2px dashed ${T.aiBorder}`,
              borderRadius: 14,
              background: T.aiBg,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'border-color .15s',
            }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 16, background: T.aiGrad, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.Upload size={24} stroke={2.2} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4 }}>Selecionar arquivo JSON</div>
              <div style={{ fontSize: 13, color: T.textMute }}>Clique para escolher ou arraste o arquivo aqui</div>
              <div style={{ fontSize: 12, color: T.textMute, marginTop: 4 }}>Apenas arquivos <code style={{ background: T.surfaceAlt, padding: '1px 5px', borderRadius: 4 }}>.json</code></div>
            </div>
          </label>
        ) : (
          /* File selected preview */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: T.surfaceAlt, borderRadius: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: T.aiBg, color: T.ai, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <I.Doc size={20} stroke={1.8} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedFile.name}</div>
                <div style={{ fontSize: 12, color: T.textMute, marginTop: 2 }}>
                  {parsedPayload ? (
                    <>
                      Matéria: <strong style={{ color: T.text }}>{parsedPayload.subject}</strong>
                      {' · '}Nível: <strong style={{ color: T.text }}>{parsedPayload.level}</strong>
                      {' · '}<strong style={{ color: T.ai }}>{questionsCount}</strong> questão(ões)
                    </>
                  ) : 'Lendo arquivo…'}
                </div>
              </div>
              <button type="button" onClick={handleClear} style={{ background: 'transparent', border: 'none', color: T.textMute, cursor: 'pointer', padding: 4 }}>
                <I.Close size={16} stroke={2} />
              </button>
            </div>

            {parseError && (
              <div style={{ fontSize: 13, color: T.danger, padding: '12px 16px', background: `${T.danger}12`, borderRadius: 10, border: `1px solid ${T.danger}30`, marginBottom: 16 }}>
                {parseError}
              </div>
            )}

            {importError && (
              <div style={{ fontSize: 13, color: T.danger, padding: '12px 16px', background: `${T.danger}12`, borderRadius: 10, border: `1px solid ${T.danger}30`, marginBottom: 16 }}>
                {importError}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center', marginTop: selectedFile ? 0 : 16 }}>
          <button
            type="button"
            onClick={() => navigate('/admin/usuarios')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: T.textDim, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, padding: 0 }}
          >
            <I.ArrowLeft size={14} stroke={2} /> Admin
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            {selectedFile && (
              <BoldBtn T={T} variant="ghost" type="button" onClick={handleClear} disabled={importing}>
                Cancelar
              </BoldBtn>
            )}
            {!selectedFile ? (
              <label htmlFor="json-upload">
                <BoldBtn T={T} variant="ai" type="button" icon={<I.Upload size={14} stroke={2} />}
                  onClick={() => fileInputRef.current?.click()}>
                  Escolher arquivo
                </BoldBtn>
              </label>
            ) : (
              <BoldBtn
                T={T}
                variant="ai"
                type="button"
                disabled={importing || !parsedPayload || !!parseError}
                icon={<I.Upload size={14} stroke={2} />}
                onClick={handleImport}
              >
                {importing ? 'Importando…' : `Importar ${questionsCount} questão(ões)`}
              </BoldBtn>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
