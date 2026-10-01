/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenType, AssessmentResult } from './types';
import { DEFAULT_ASSESSMENT, calculateAssessment } from './data/assessmentData';
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

  // Initial answers preset matching the 85/100 score in the reference design
  const [answers, setAnswers] = useState<Record<string, number>>({
    q1: 2, // Descalificación hostil recurrente
    q2: 3, // Sobrecarga selectiva y plazos imposibles
    q3: 2, // Entorpecimiento laboral
    q4: 3, // Aislamiento profesional deliberado
    q5: 3, // Intimidación sutil
  });

  const [assessment, setAssessment] = useState<AssessmentResult>(DEFAULT_ASSESSMENT);

  // Recalculate assessment whenever answers change
  useEffect(() => {
    const updated = calculateAssessment(answers);
    setAssessment(updated);
  }, [answers]);

  const handleAnswerChange = (questionId: string, points: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: points,
    }));
  };

  const handleSetAllAnswers = (newAnswers: Record<string, number>) => {
    setAnswers(newAnswers);
  };

  // Emergency Panic: 0-trace purge and switch to AeroSalud Protocol or decoy
  const handleQuickExit = () => {
    try {
      sessionStorage.clear();
      localStorage.removeItem('vitality_shield_temp_session');
    } catch {
      // ignore
    }
    setCurrentScreen('aerosalud');
  };

  const handlePurgeAndRedirectGoogle = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      // Purge from cloud database asynchronously
      purgeAssessmentFromDatabase(assessment.anonymousId);
    } catch {
      // ignore
    }
    window.location.replace('https://www.google.com/search?q=recetas+saludables+faciles');
  };

  const handleSafeExit = () => {
    // Graceful exit
    try {
      sessionStorage.clear();
    } catch {
      // ignore
    }
    setCurrentScreen('inicio');
  };

  return (
    <div className="bg-[#0a0e1a] text-[#e0e8f0] font-body min-h-screen flex flex-col selection:bg-[#7dd3fc]/20 selection:text-[#7dd3fc]">
      {/* Top App Header */}
      {currentScreen !== 'camuflaje' && (
        <Header currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 flex flex-col relative w-full ${
          currentScreen === 'camuflaje' ? 'pt-0' : 'pt-16 pb-24'
        } bg-[#0a0e1a] min-h-screen`}
      >
        {currentScreen === 'inicio' && <ScreenInicio onNavigate={setCurrentScreen} />}

        {currentScreen === 'test' && (
          <ScreenTest
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onSetAllAnswers={handleSetAllAnswers}
            onNavigate={setCurrentScreen}
            currentResult={assessment}
          />
        )}

        {currentScreen === 'diagnostico' && (
          <ScreenDiagnostico
            assessment={assessment}
            answers={answers}
            onNavigate={setCurrentScreen}
            onPurgeAndExit={handlePurgeAndRedirectGoogle}
          />
        )}

        {currentScreen === 'boveda' && (
          <ScreenBoveda
            assessment={assessment}
            onPurgeAndRedirect={handlePurgeAndRedirectGoogle}
            onSafeExit={handleSafeExit}
          />
        )}

        {currentScreen === 'aerosalud' && (
          <ScreenAeroSalud
            onNavigate={setCurrentScreen}
            onRedirectGoogle={handlePurgeAndRedirectGoogle}
          />
        )}

        {currentScreen === 'camuflaje' && (
          <ScreenCamouflage onReturnToApp={() => setCurrentScreen('inicio')} />
        )}
      </main>

      {/* Floating Emergency Panic Button (Hidden on Camouflage screen) */}
      {currentScreen !== 'camuflaje' && currentScreen !== 'aerosalud' && (
        <QuickExitButton onQuickExit={handleQuickExit} />
      )}

      {/* Bottom Navigation Bar */}
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </div>
  );
}
