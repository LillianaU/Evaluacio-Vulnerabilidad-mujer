/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ScreenType, AnswersMap, QuestionId } from './types';
import { INITIAL_ANSWERS, calculateAssessment } from './data/assessmentData';
import { EtherealFloralBackdrop } from './components/EtherealFloralBackdrop';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { QuickExitButton } from './components/QuickExitButton';
import { ScreenInicio } from './components/ScreenInicio';
import { ScreenTest } from './components/ScreenTest';
import { ScreenDiagnostico } from './components/ScreenDiagnostico';
import { ScreenBoveda } from './components/ScreenBoveda';
import { ScreenAeroSalud } from './components/ScreenAeroSalud';
import { ScreenCamouflage } from './components/ScreenCamouflage';
import { purgeAssessmentFromDatabase } from './services/api';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('inicio');
  const [answers, setAnswers] = useState<AnswersMap>(INITIAL_ANSWERS);
  const [sessionUuid, setSessionUuid] = useState<string>('uuid-v4-anonimo-89f2');
  const [isSavedInVault, setIsSavedInVault] = useState<boolean>(false);
  const [zeroTraceAutoPurge, setZeroTraceAutoPurge] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const assessmentResult = useMemo(
    () => calculateAssessment(answers, sessionUuid),
    [answers, sessionUuid]
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const handleAnswerChange = (questionId: QuestionId, points: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: points,
    }));
  };

  const handleLoadSampleCase = () => {
    setAnswers({
      q1: 3,
      q2: 3,
      q3: 2,
      q4: 2,
      q5: 3,
    });
    showToast('Caso tipo cargado (escenario de alto riesgo 87/100).');
  };

  // Emergency Panic: 0-trace purge and switch to AeroSalud Protocol
  const handleQuickExit = () => {
    try {
      sessionStorage.clear();
      localStorage.clear();
      purgeAssessmentFromDatabase(sessionUuid);
    } catch {
      // ignore sandbox errors
    }
    setAnswers(INITIAL_ANSWERS);
    setIsSavedInVault(false);
    setSessionUuid(`uuid-v4-anonimo-${Math.floor(1000 + Math.random() * 9000)}`);
    setCurrentScreen('aerosalud');
  };

  const handlePurgeAndRedirectGoogle = () => {
    try {
      sessionStorage.clear();
      localStorage.clear();
      purgeAssessmentFromDatabase(sessionUuid);
    } catch {
      // ignore sandbox errors
    }
    setAnswers(INITIAL_ANSWERS);
    setIsSavedInVault(false);
    window.location.replace('https://www.google.com/search?q=recetas+saludables+faciles');
  };

  // Vista Camuflaje a pantalla completa
  if (currentScreen === 'camuflaje') {
    return <ScreenCamouflage onReturnToApp={() => setCurrentScreen('inicio')} />;
  }

  return (
    <div className="min-h-screen relative text-white flex flex-col selection:bg-pink-400 selection:text-purple-950">
      {/* Fondo etéreo con flores espectrales, estrellas y resplandores púrpura/rosa */}
      <EtherealFloralBackdrop />

      {/* Encabezado global (se adapta a AeroSalud y se oculta en Camuflaje) */}
      <Header currentScreen={currentScreen} onNavigate={setCurrentScreen} />

      {/* Notificación flotante sutil */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#231136]/95 text-pink-100 text-xs font-semibold border border-pink-300/50 shadow-xl">
          {toastMessage}
        </div>
      )}

      {/* Contenedor central mobile-first */}
      <main className="relative z-10 flex-1 w-full max-w-lg mx-auto px-4 pt-4 pb-28">
        {currentScreen === 'inicio' && <ScreenInicio onNavigate={setCurrentScreen} />}

        {currentScreen === 'test' && (
          <ScreenTest
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onLoadSampleCase={handleLoadSampleCase}
            onNavigate={setCurrentScreen}
            currentResult={assessmentResult}
          />
        )}

        {currentScreen === 'diagnostico' && (
          <ScreenDiagnostico
            assessment={assessmentResult}
            answers={answers}
            isSavedInVault={isSavedInVault}
            onSavedToVault={() => {
              setIsSavedInVault(true);
              showToast('Diagnóstico guardado en la Bóveda volátil.');
            }}
            onNavigate={setCurrentScreen}
            onQuickPurge={handleQuickExit}
          />
        )}

        {currentScreen === 'boveda' && (
          <ScreenBoveda
            sessionUuid={sessionUuid}
            assessment={assessmentResult}
            answers={answers}
            zeroTraceAutoPurge={zeroTraceAutoPurge}
            onTogglePolicy={(val) => {
              setZeroTraceAutoPurge(val);
              showToast(
                val
                  ? 'Política Cero Huella estricto activada.'
                  : 'Retención en memoria volátil activada.'
              );
            }}
            onDestroyVault={handleQuickExit}
          />
        )}

        {currentScreen === 'aerosalud' && (
          <ScreenAeroSalud
            onNavigate={setCurrentScreen}
            onRedirectGoogle={handlePurgeAndRedirectGoogle}
          />
        )}
      </main>

      {/* Pie discreto */}
      <footer className="relative z-10 text-center text-[11px] text-purple-200/70 pb-24">
        © 2026 Vitality Shield · Protocolo 0-Trace · Ley 1010 de 2006 (Colombia)
      </footer>

      {/* Botones flotantes permanentes: Llamar 123 + Salida Rápida */}
      <QuickExitButton currentScreen={currentScreen} onQuickExit={handleQuickExit} />

      {/* Navegación inferior fija */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        hasDiagnosis={Object.values(answers).some((v) => v !== null)}
      />
    </div>
  );
}
