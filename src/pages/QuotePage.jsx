import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { animate } from 'motion'
import { Helmet } from 'react-helmet-async'
import { TIERS, COMBOS, getCombosByTier } from '../data/menuData'
import { calculateQuoteRange, formatCurrency, formatRange } from '../utils/quoteCalculations'
import { supabase } from '../lib/supabase'
import { sendEmailViaResend } from '../lib/resendEmail'
import { pageMetadata, getCanonicalUrl, SITE_NAME, DEFAULT_OG_IMAGE, getSchemaOrgData } from '../lib/seo'
import './QuotePage.css'

const STEPS = ['Your Event', 'Choose Tier', 'Build Your Menu', 'Your Info', 'Review & Submit'];
const EVENT_TYPES = ['Wedding', 'Corporate Event', 'Birthday / Celebration', 'Holiday Party', 'Graduation', 'Casual Gathering', 'Other'];

function ProgressBar({ currentStep }) {
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  return (
    <div className="quote-progress">
      <div className="quote-progress__bar">
        <div className="quote-progress__fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="quote-progress__labels">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className={`quote-progress__label${i === currentStep ? ' active' : ''}${i < currentStep ? ' done' : ''}`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepTransition({ step, children }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current) return;
    animate(ref.current, { opacity: [0, 1], x: [-20, 0] }, { duration: 0.3, easing: 'ease-out' });
  }, [step]);

  return <div ref={ref} className="quote-step">{children}</div>;
}

function SmallGroupModal({ onCustom, onContinue }) {
  return (
    <div className="quote-modal-overlay" onClick={onContinue}>
      <div className="quote-modal" onClick={e => e.stopPropagation()}>
        <h2>Considering a smaller gathering?</h2>
        <p>
          For groups under 30, a custom menu is often a better fit — we can tailor everything
          specifically to your event without locking into a set package.
        </p>
        <div className="quote-modal__buttons">
          <button className="quote-form__btn quote-form__btn--outline" onClick={onContinue}>
            No thanks, continue with standard options
          </button>
          <button className="quote-form__btn quote-form__btn--primary" onClick={onCustom}>
            Yes, I'd like a custom menu
          </button>
        </div>
      </div>
    </div>
  );
}

function OpulenceBrochure({ onEventDescriptionChange, eventDescription }) {
  return (
    <StepTransition step={2}>
      <h2 className="quote-step__title">Opulence — The Ultimate Experience</h2>

      <div className="opulence-brochure">
        <div className="opulence-section">
          <h3>Every detail is tailored specifically to your event.</h3>
          <p>
            From the moment you reach out, our Executive Chef works directly with you to craft
            a menu that tells your story. This isn't a package — it's a collaboration.
          </p>
        </div>

        <div className="opulence-highlights">
          <div className="opulence-highlight">
            <h4>Custom Menu Development</h4>
            <p>Work directly with our Executive Chef to design every course and element.</p>
          </div>
          <div className="opulence-highlight">
            <h4>Full On-Site Staffing</h4>
            <p>Dedicated chef, full waitstaff (1 per 10 guests), bartender, and event coordinator.</p>
          </div>
          <div className="opulence-highlight">
            <h4>Multi-Course Plated Service</h4>
            <p>Served on fine China with real silverware and glassware.</p>
          </div>
          <div className="opulence-highlight">
            <h4>Premium & Wagyu Proteins</h4>
            <p>Only the finest selections as standard.</p>
          </div>
          <div className="opulence-highlight">
            <h4>Amuse-Bouche by the Chef</h4>
            <p>A custom bite created fresh for your event.</p>
          </div>
          <div className="opulence-highlight">
            <h4>Signature Mocktails</h4>
            <p>Custom-paired to complement your menu.</p>
          </div>
          <div className="opulence-highlight">
            <h4>White-Glove Presentation</h4>
            <p>Premium table styling and meticulous attention to every detail.</p>
          </div>
        </div>

        <div className="quote-form">
          <div className="quote-form__group">
            <label className="quote-form__label">Tell us about your event *</label>
            <textarea
              className="quote-form__textarea"
              value={eventDescription || ''}
              onChange={e => onEventDescriptionChange(e.target.value)}
              placeholder="Share as much as you'd like — the date, the occasion, the number of guests, the vibe you're going for, any dietary needs, and anything else that matters to you. The more you share, the better we can prepare."
              rows="6"
            />
            <p className="quote-form__hint">This helps us understand your vision so we can create something extraordinary.</p>
          </div>
        </div>
      </div>
    </StepTransition>
  );
}

function TierCard({ tier, isSelected, onSelect }) {
  const showPrice = tier.pricePerPersonLow !== null;

  return (
    <div
      className={`tier-card tier-card--${tier.key}${isSelected ? ' selected' : ''}`}
      onClick={onSelect}
    >
      <div className="tier-card__header">
        <h3 className="tier-card__name">{tier.name}</h3>
        <p className="tier-card__tagline">{tier.tagline}</p>
      </div>

      {showPrice && (
        <div className="tier-card__price">
          <span className="tier-card__price-text">${tier.pricePerPersonLow}–${tier.pricePerPersonHigh}</span>
          <span className="tier-card__price-label">per person</span>
        </div>
      )}

      {!showPrice && (
        <div className="tier-card__price tier-card__price--custom">
          <p className="tier-card__custom-text">Custom pricing — tailored to your event</p>
        </div>
      )}

      <p className="tier-card__description">{tier.description}</p>

      <button className="tier-card__btn">
        {isSelected ? '✓ Selected' : 'Select This Option'}
      </button>
    </div>
  );
}

function Step1EventDetails({ data, onChange, isNonprofit, setIsNonprofit, onNext }) {
  const errors = {};
  if (!data.guestCountMin || data.guestCountMin < 1) errors.guestCountMin = 'Minimum guests required (at least 1)';
  if (!data.guestCountMax || data.guestCountMax < data.guestCountMin) errors.guestCountMax = 'Maximum guests must be >= minimum';

  const canProceed = !Object.keys(errors).length;

  return (
    <StepTransition step={1}>
      <h2 className="quote-step__title">Tell Us About Your Event</h2>

      <div className="quote-form">
        <div className="quote-form__group">
          <label className="quote-form__label">Minimum Guests Expected</label>
          <input
            type="number"
            className="quote-form__input"
            min="1"
            value={data.guestCountMin || ''}
            onChange={e => onChange({ guestCountMin: Number(e.target.value) })}
            placeholder="e.g., 20"
          />
          {errors.guestCountMin && <p className="quote-form__error">{errors.guestCountMin}</p>}
        </div>

        <div className="quote-form__group">
          <label className="quote-form__label">Maximum Guests (your best guess)</label>
          <input
            type="number"
            className="quote-form__input"
            min="1"
            value={data.guestCountMax || ''}
            onChange={e => onChange({ guestCountMax: Number(e.target.value) })}
            placeholder="e.g., 50"
          />
          {errors.guestCountMax && <p className="quote-form__error">{errors.guestCountMax}</p>}
        </div>

        <div className="quote-form__group">
          <label className="quote-form__label">Event Type</label>
          <select
            className="quote-form__select"
            value={data.eventType || ''}
            onChange={e => onChange({ eventType: e.target.value })}
          >
            <option value="">Select event type…</option>
            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="quote-form__group">
          <label className="quote-form__label">Event Date (optional, if known)</label>
          <input
            type="date"
            className="quote-form__input"
            value={data.eventDate || ''}
            onChange={e => onChange({ eventDate: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="quote-form__group">
          <label className="quote-form__checkbox-label">
            <input
              type="checkbox"
              checked={isNonprofit}
              onChange={e => setIsNonprofit(e.target.checked)}
            />
            <span>This event is for a non-profit organization</span>
          </label>
        </div>

        <button
          className="quote-form__btn quote-form__btn--primary"
          onClick={onNext}
          disabled={!canProceed}
        >
          Next: Choose Your Option
        </button>
      </div>
    </StepTransition>
  );
}

function Step2ChooseTier({ selectedTierId, onSelect, onNext }) {
  const handleSelect = (tierId) => {
    onSelect(tierId);
    setTimeout(onNext, 400);
  };

  return (
    <StepTransition step={2}>
      <h2 className="quote-step__title">Choose Your Option</h2>
      <div className="tiers-grid">
        {TIERS.map(tier => (
          <TierCard
            key={tier.id}
            tier={tier}
            isSelected={tier.id === selectedTierId}
            onSelect={() => handleSelect(tier.id)}
          />
        ))}
      </div>
    </StepTransition>
  );
}

function ComboCard({ combo, isSelected, onSelect }) {
  return (
    <div
      className={`combo-card${isSelected ? ' selected' : ''}`}
      onClick={onSelect}
    >
      <div className="combo-card__header">
        <h4 className="combo-card__name">{combo.name}</h4>
        {combo.tier === 'splurge' && <span className="combo-card__badge">Splurge</span>}
      </div>
      <p className="combo-card__description">{combo.description}</p>

      <div className="combo-card__components">
        {combo.components.map((comp, i) => (
          <div key={i} className="combo-component">
            <span className="combo-component__type">{comp.type}:</span>
            <span className="combo-component__name">{comp.name}</span>
          </div>
        ))}
      </div>

      <button className="combo-card__btn">
        {isSelected ? '✓ Selected' : 'Select'}
      </button>
    </div>
  );
}

function Step3BuildMenu({ selectedTierId, selectedCombos, onToggleCombo, calculated, onUpgradeClick }) {
  const availableCombos = getCombosByTier(selectedTierId);
  if (!availableCombos.length) return null;

  const standardCombos = availableCombos.filter(c => c.tier === 'standard');
  const splurgeCombos = availableCombos.filter(c => c.tier === 'splurge');

  const tierData = TIERS.find(t => t.id === selectedTierId);
  const isSplurge = tierData.key === 'splurge';

  return (
    <StepTransition step={3}>
      <h2 className="quote-step__title">Build Your Menu</h2>

      <div className="combo-selector">
        <div className="combo-section">
          <h3 className="combo-section__title">All Options</h3>
          <div className="combo-grid">
            {standardCombos.map(combo => (
              <ComboCard
                key={combo.id}
                combo={combo}
                isSelected={selectedCombos.some(c => c.id === combo.id)}
                onSelect={() => onToggleCombo(combo)}
              />
            ))}
          </div>
        </div>

        {splurgeCombos.length > 0 && isSplurge && (
          <div className="combo-section">
            <h3 className="combo-section__title combo-section__title--splurge">Premium Options</h3>
            <div className="combo-grid">
              {splurgeCombos.map(combo => (
                <ComboCard
                  key={combo.id}
                  combo={combo}
                  isSelected={selectedCombos.some(c => c.id === combo.id)}
                  onSelect={() => onToggleCombo(combo)}
                />
              ))}
            </div>
          </div>
        )}

        {!isSplurge && splurgeCombos.length > 0 && (
          <div className="combo-upsell">
            <p><strong>Want more options?</strong> Upgrade to Splurge a Little to unlock premium combo options and elevated menu items.</p>
            <button className="quote-form__btn quote-form__btn--outline" onClick={onUpgradeClick}>
              Upgrade my tier
            </button>
          </div>
        )}

        {selectedCombos.length > 0 && (
          <div className="combo-pricing">
            <h4>Your Selections</h4>
            <p className="combo-count">{selectedCombos.length} combo{selectedCombos.length !== 1 ? 's' : ''} selected</p>
            {selectedCombos.length > 1 && (
              <p className="combo-multiplier-note">
                Adding {selectedCombos.length - 1} additional combo{selectedCombos.length > 2 ? 's adds' : ' adds'} approximately +{((selectedCombos.length - 1) * 50)}% per person to your estimate.
              </p>
            )}
            {selectedCombos.length >= 4 && (
              <p className="combo-note">For events with 4+ food stations, we recommend reaching out directly so we can plan logistics properly.</p>
            )}
            {calculated.showPrice && (
              <div className="estimated-price">
                <p><strong>Estimated per person:</strong> ${calculated.perPersonLow}–${calculated.perPersonHigh}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </StepTransition>
  );
}

function Step4YourInfo({ selectedTierId, formData, onChange, errors, eventDescription }) {
  const tier = TIERS.find(t => t.id === selectedTierId);
  const isCustom = tier.key === 'custom';

  return (
    <StepTransition step={4}>
      <h2 className="quote-step__title">Your Information</h2>

      {isCustom && (
        <p className="quote-form__intro">Tell us what you have in mind and we'll put together something just for you.</p>
      )}

      <div className="quote-form">
        <div className="quote-form__group">
          <label className="quote-form__label">Full Name *</label>
          <input
            type="text"
            className="quote-form__input"
            value={formData.name || ''}
            onChange={e => onChange({ name: e.target.value })}
            placeholder="Your name"
          />
          {errors.name && <p className="quote-form__error">{errors.name}</p>}
        </div>

        <div className="quote-form__group">
          <label className="quote-form__label">Email Address *</label>
          <input
            type="email"
            className="quote-form__input"
            value={formData.email || ''}
            onChange={e => onChange({ email: e.target.value })}
            placeholder="your@email.com"
          />
          {errors.email && <p className="quote-form__error">{errors.email}</p>}
        </div>

        <div className="quote-form__group">
          <label className="quote-form__label">Phone Number</label>
          <input
            type="tel"
            className="quote-form__input"
            value={formData.phone || ''}
            onChange={e => onChange({ phone: e.target.value })}
            placeholder="(903) 123-4567"
          />
        </div>

        {!eventDescription && (
          <div className="quote-form__group">
            <label className="quote-form__label">Message / Special Requests</label>
            <textarea
              className="quote-form__textarea"
              value={formData.message || ''}
              onChange={e => onChange({ message: e.target.value })}
              placeholder="Tell us about your event, dietary restrictions, special requests…"
              rows="5"
            />
            <p className="quote-form__hint">Please include a brief explanation of what you're looking for — this helps us create the perfect menu for your event.</p>
          </div>
        )}
      </div>
    </StepTransition>
  );
}

function ReviewSummary({ tier, selectedCombos, guestCountMin, guestCountMax, calculated, isOpulence }) {
  return (
    <div className="review-summary">
      <div className="review-summary__section">
        <h4>Option & Pricing</h4>
        <p><strong>{tier.name}</strong></p>
        {calculated.showPrice ? (
          <p>${calculated.perPersonLow}–${calculated.perPersonHigh}/person</p>
        ) : (
          <p><em>Custom pricing — tailored to your event</em></p>
        )}
      </div>

      <div className="review-summary__section">
        <h4>Guests</h4>
        <p>{guestCountMin}–{guestCountMax} guests</p>
      </div>

      {selectedCombos.length > 0 && !isOpulence && (
        <div className="review-summary__section">
          <h4>Combos ({selectedCombos.length})</h4>
          <ul>
            {selectedCombos.map((c, i) => <li key={i}>{c.name}</li>)}
          </ul>
        </div>
      )}

      {calculated.showPrice && (
        <div className="review-summary__section">
          <h4>Estimated Total</h4>
          <p className="review-summary__total">${calculated.totalLow}–${calculated.totalHigh}</p>
        </div>
      )}
    </div>
  );
}

function Step5ReviewSubmit({ tier, selectedCombos, guestCountMin, guestCountMax, formData, calculated, eventDescription, isNonprofit, onSubmit, isSubmitting, submitError }) {
  const isOpulence = tier.key === 'opulence';
  const isCustom = tier.key === 'custom';

  return (
    <StepTransition step={5}>
      <h2 className="quote-step__title">Review & Submit</h2>

      <div className="review-container">
        <div className="review-main">
          {isNonprofit && (
            <section className="review-section review-section--highlight">
              <p><strong>✓ Non-profit event</strong> — We'll handle pricing considerations.</p>
            </section>
          )}

          {isOpulence && (
            <section className="review-section">
              <h3>Your Event</h3>
              <p>{eventDescription}</p>
            </section>
          )}

          <section className="review-section">
            <h3>Event Details</h3>
            <div className="review-detail">
              <span className="review-detail__label">Type:</span>
              <span>{formData.eventType || '—'}</span>
            </div>
            <div className="review-detail">
              <span className="review-detail__label">Date:</span>
              <span>{formData.eventDate || '(Not specified)'}</span>
            </div>
            <div className="review-detail">
              <span className="review-detail__label">Guests:</span>
              <span>{guestCountMin}–{guestCountMax}</span>
            </div>
          </section>

          <section className="review-section">
            <h3>Option</h3>
            <p><strong>{tier.name}</strong></p>
          </section>

          {selectedCombos.length > 0 && !isOpulence && (
            <section className="review-section">
              <h3>Selected Combos</h3>
              {selectedCombos.map((combo, i) => (
                <div key={i} className="review-combo">
                  <h4>{combo.name}</h4>
                  <ul>
                    {combo.components.map((comp, j) => (
                      <li key={j}><strong>{comp.type}:</strong> {comp.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          <section className="review-section">
            <h3>Your Contact Info</h3>
            <div className="review-detail">
              <span className="review-detail__label">Name:</span>
              <span>{formData.name}</span>
            </div>
            <div className="review-detail">
              <span className="review-detail__label">Email:</span>
              <span>{formData.email}</span>
            </div>
            {formData.phone && (
              <div className="review-detail">
                <span className="review-detail__label">Phone:</span>
                <span>{formData.phone}</span>
              </div>
            )}
            {formData.message && (
              <div className="review-detail">
                <span className="review-detail__label">Message:</span>
                <span>{formData.message}</span>
              </div>
            )}
          </section>

          {calculated.showPrice && (
            <div className="review-disclaimer">
              <p>This is an estimate based on your selections. Final pricing will be confirmed by Humble Chef after reviewing your request.</p>
            </div>
          )}

          {!calculated.showPrice && (
            <div className="review-disclaimer">
              <p>We'll review your event details and reach out with a custom quote tailored to your needs.</p>
            </div>
          )}

          {submitError && <p className="quote-form__error quote-form__error--submit">{submitError}</p>}

          <button
            className="quote-form__btn quote-form__btn--primary"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit My Quote Request'}
          </button>
        </div>

        <aside className="review-sidebar">
          <ReviewSummary
            tier={tier}
            selectedCombos={selectedCombos}
            guestCountMin={guestCountMin}
            guestCountMax={guestCountMax}
            calculated={calculated}
            isOpulence={isOpulence}
          />
        </aside>
      </div>
    </StepTransition>
  );
}

function ConfirmationScreen({ formData }) {
  const handleStartNewQuote = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <StepTransition step={6}>
      <div className="confirmation">
        <div className="confirmation__icon">✓</div>
        <h2 className="confirmation__title">Your quote request has been submitted!</h2>
        <p className="confirmation__subtitle">
          We'll review your selections and reach out within 1–2 business days.
        </p>

        <div className="confirmation__note">
          A confirmation email has been sent to <strong>{formData.email}</strong>
        </div>

        <div className="confirmation__buttons">
          <button
            className="quote-form__btn quote-form__btn--primary"
            onClick={() => window.location.href = '/'}
          >
            Go Back to Home
          </button>
          <button
            className="quote-form__btn quote-form__btn--outline"
            onClick={handleStartNewQuote}
          >
            Start a New Quote
          </button>
        </div>
      </div>
    </StepTransition>
  );
}

const STORAGE_KEY = 'hc_quote_wizard_state';

function getInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load quote state:', e);
  }
  return null;
}

export default function QuotePage() {
  const navigate = useNavigate();
  const initialState = getInitialState();

  const [currentStep, setCurrentStep] = useState(initialState?.currentStep ?? 0);
  const [selectedTierId, setSelectedTierId] = useState(initialState?.selectedTierId ?? null);
  const [selectedCombos, setSelectedCombos] = useState(initialState?.selectedCombos ?? []);
  const [isNonprofit, setIsNonprofit] = useState(initialState?.isNonprofit ?? false);
  const [eventDescription, setEventDescription] = useState(initialState?.eventDescription ?? '');
  const [hasSeenSmallGroupPrompt, setHasSeenSmallGroupPrompt] = useState(initialState?.hasSeenSmallGroupPrompt ?? false);
  const [showSmallGroupModal, setShowSmallGroupModal] = useState(false);
  const [formData, setFormData] = useState(initialState?.formData ?? { name: '', email: '', phone: '', message: '' });
  const [eventData, setEventData] = useState(initialState?.eventData ?? { guestCountMin: null, guestCountMax: null, eventType: '', eventDate: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const tier = selectedTierId ? TIERS.find(t => t.id === selectedTierId) : null;
  const calculated = tier ? calculateQuoteRange(selectedTierId, selectedCombos, eventData.guestCountMin, eventData.guestCountMax) : null;

  React.useEffect(() => {
    const state = {
      currentStep,
      selectedTierId,
      selectedCombos,
      isNonprofit,
      eventDescription,
      hasSeenSmallGroupPrompt,
      formData,
      eventData
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save quote state:', e);
    }
  }, [currentStep, selectedTierId, selectedCombos, isNonprofit, eventDescription, hasSeenSmallGroupPrompt, formData, eventData]);

  const handleNext = useCallback(() => {
    let stepErrors = {};

    if (currentStep === 0) {
      if (!eventData.guestCountMin || eventData.guestCountMin < 1) stepErrors.guestCountMin = 'Minimum guests required';
      if (!eventData.guestCountMax || eventData.guestCountMax < eventData.guestCountMin) stepErrors.guestCountMax = 'Max must be >= min';

      if (!Object.keys(stepErrors).length) {
        // Check for small group modal
        if (!hasSeenSmallGroupPrompt && eventData.guestCountMin < 30 && eventData.guestCountMax < 30) {
          setShowSmallGroupModal(true);
          setHasSeenSmallGroupPrompt(true);
          return;
        }
      }
    }

    if (currentStep === 1) {
      if (!selectedTierId) {
        stepErrors.tier = 'Please select an option';
      } else {
        const selectedTier = TIERS.find(t => t.id === selectedTierId);

        // Handle different tier flows
        if (selectedTier.key === 'opulence') {
          // Opulence goes to brochure step
          setCurrentStep(2);
          return;
        } else if (selectedTier.key === 'custom') {
          // Custom goes directly to info step
          setCurrentStep(3);
          return;
        }
        // Standard/Splurge continue normally
      }
    }

    if (currentStep === 2) {
      // Combo selection step or opulence brochure step
      if (tier.key === 'opulence') {
        if (!eventDescription.trim()) {
          stepErrors.eventDescription = 'Please tell us about your event';
        }
      } else {
        if (selectedCombos.length === 0) {
          stepErrors.combos = 'Please select at least one combo';
        }
      }
    }

    if (currentStep === 3 && tier.key !== 'custom') {
      // Custom tier skips this validation
    }

    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, eventData, selectedTierId, selectedCombos, eventDescription, tier, hasSeenSmallGroupPrompt]);

  const handleSmallGroupCustom = () => {
    setShowSmallGroupModal(false);
    setSelectedTierId(4); // Custom tier
    setCurrentStep(1);
  };

  const handleSmallGroupContinue = () => {
    setShowSmallGroupModal(false);
    setCurrentStep(currentStep + 1);
  };

  const handleToggleCombo = useCallback((combo) => {
    setSelectedCombos(prev => {
      const exists = prev.find(c => c.id === combo.id);
      if (exists) {
        return prev.filter(c => c.id !== combo.id);
      } else {
        return [...prev, { id: combo.id, name: combo.name }];
      }
    });
  }, []);

  const handleUpgradeTier = useCallback(() => {
    setSelectedTierId(2); // Splurge tier
    // Combos stay the same
  }, []);

  const validateStep4 = () => {
    const stepErrors = {};
    if (!formData.name.trim()) stepErrors.name = 'Name is required';
    if (!formData.email.trim()) stepErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) stepErrors.email = 'Enter a valid email';
    setErrors(stepErrors);
    return !Object.keys(stepErrors).length;
  };

  const handleSubmit = async () => {
    if (!validateStep4()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Build subject line
      let subject = 'New Quote Request';
      if (isNonprofit) subject = `[NON-PROFIT] ${subject}`;
      if (tier.key === 'opulence') subject = `OPULENCE — ${subject}`;

      const guestRange = eventData.guestCountMin < 30 && eventData.guestCountMax < 30
        ? 'Small/Custom Group'
        : `${eventData.guestCountMin}–${eventData.guestCountMax} guests`;

      subject += ` — ${tier.name} — ${guestRange} — ${formData.name}`;

      const quotePayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message || null,
        event_date: eventData.eventDate || null,
        event_type: eventData.eventType,
        guest_count_min: eventData.guestCountMin,
        guest_count_max: eventData.guestCountMax,
        tier_id: tier.id,
        tier_name: tier.name,
        base_price_low: tier.pricePerPersonLow,
        base_price_high: tier.pricePerPersonHigh,
        selected_combos: selectedCombos,
        event_description: eventDescription || null,
        total_low: calculated.totalLow,
        total_high: calculated.totalHigh,
        is_nonprofit: isNonprofit,
        status: 'new'
      };

      const { error: insertError } = await supabase
        .from('quotes')
        .insert([quotePayload]);

      if (insertError) throw insertError;

      await sendEmailViaResend({
        to: 'humblechefbrian@gmail.com',
        subject,
        html: buildAdminEmailHTML(quotePayload, isNonprofit)
      });

      await sendEmailViaResend({
        to: formData.email,
        subject: 'Your Humble Chef Quote Request Has Been Received',
        html: buildCustomerEmailHTML(formData.name, tier, selectedCombos, calculated)
      });

      localStorage.removeItem(STORAGE_KEY);
      navigate('/quote/submitted');
    } catch (err) {
      console.error('Quote submission error:', err);
      setSubmitError('Something went wrong. Please try again or contact us at humblechefbrian@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = useCallback(() => {
    if (currentStep === 3 && tier?.key === 'custom') {
      setCurrentStep(1);
    } else if (currentStep === 2 && tier?.key === 'opulence') {
      setCurrentStep(1);
    } else {
      setCurrentStep(Math.max(0, currentStep - 1));
    }
  }, [currentStep, tier]);

  const meta = pageMetadata.quote;
  const isOpulence = tier?.key === 'opulence';
  const isCustom = tier?.key === 'custom';

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={getCanonicalUrl(meta.path)} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(getSchemaOrgData())}
        </script>
      </Helmet>
      <div className="quote-page">
        <ProgressBar currentStep={currentStep} />

        {showSmallGroupModal && (
          <SmallGroupModal onCustom={handleSmallGroupCustom} onContinue={handleSmallGroupContinue} />
        )}

        <div className="quote-container">
          {currentStep === 0 && (
            <Step1EventDetails
              data={eventData}
              onChange={(updates) => setEventData(prev => ({ ...prev, ...updates }))}
              isNonprofit={isNonprofit}
              setIsNonprofit={setIsNonprofit}
              onNext={handleNext}
            />
          )}

          {currentStep === 1 && (
            <Step2ChooseTier
              selectedTierId={selectedTierId}
              onSelect={setSelectedTierId}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && isOpulence && (
            <OpulenceBrochure
              eventDescription={eventDescription}
              onEventDescriptionChange={setEventDescription}
            />
          )}

          {currentStep === 2 && !isOpulence && tier && (
            <Step3BuildMenu
              selectedTierId={selectedTierId}
              selectedCombos={selectedCombos}
              onToggleCombo={handleToggleCombo}
              calculated={calculated}
              onUpgradeClick={handleUpgradeTier}
            />
          )}

          {currentStep === 3 && tier && (
            <Step4YourInfo
              selectedTierId={selectedTierId}
              formData={formData}
              onChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
              errors={errors}
              eventDescription={eventDescription}
            />
          )}

          {currentStep === 4 && tier && calculated && (
            <Step5ReviewSubmit
              tier={tier}
              selectedCombos={selectedCombos}
              guestCountMin={eventData.guestCountMin}
              guestCountMax={eventData.guestCountMax}
              formData={formData}
              calculated={calculated}
              eventDescription={eventDescription}
              isNonprofit={isNonprofit}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          )}

          {currentStep === 5 && (
            <ConfirmationScreen formData={formData} />
          )}
        </div>

        <div className="quote-page__navigation">
          <button
            className="quote-form__btn quote-form__btn--outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </button>

          {currentStep < 4 && (
            <button
              className="quote-form__btn quote-form__btn--primary"
              onClick={handleNext}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function buildAdminEmailHTML(quote, isNonprofit) {
  let html = `
    <div style="font-family: Montserrat, sans-serif; max-width: 600px; margin: 0 auto;">
  `;

  if (quote.tier_name === 'Opulence') {
    html += `
      <div style="background: #DC2626; color: #fff; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
        <p style="margin: 0; font-weight: bold;">⚡ OPULENCE REQUEST — Schedule a call with this client as soon as possible.</p>
      </div>
    `;
  }

  if (isNonprofit) {
    html += `
      <div style="background: #FEF3C7; color: #92400E; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 3px solid #FBBF24;">
        <p style="margin: 0; font-weight: bold;">⚠️ NON-PROFIT EVENT — Handle pricing manually. Do not send standard quote response.</p>
      </div>
    `;
  }

  html += `
      <h2 style="color: #2340;">New Quote Request</h2>
      <div style="background: #f5f5f5; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
        <p><strong>From:</strong> ${quote.name}</p>
        <p><strong>Email:</strong> ${quote.email}</p>
        <p><strong>Phone:</strong> ${quote.phone || 'Not provided'}</p>
      </div>
      <div style="background: #f5f5f5; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
        <p><strong>Event Type:</strong> ${quote.event_type}</p>
        <p><strong>Date:</strong> ${quote.event_date || 'Not specified'}</p>
        <p><strong>Guests:</strong> ${quote.guest_count_min}–${quote.guest_count_max}</p>
      </div>
      <div style="background: #f5f5f5; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
        <p><strong>Option:</strong> ${quote.tier_name}</p>
        ${quote.base_price_low ? `<p><strong>Price Range:</strong> $${quote.base_price_low}–$${quote.base_price_high}/person</p>` : '<p><strong>Pricing:</strong> Custom (to be discussed)</p>'}
        ${quote.total_low ? `<p><strong>Estimated Total:</strong> $${quote.total_low}–$${quote.total_high}</p>` : ''}
      </div>
  `;

  if (quote.selected_combos && quote.selected_combos.length > 0) {
    html += `
      <div style="margin: 1rem 0;">
        <h3>Selected Combos</h3>
        <ul>
          ${quote.selected_combos.map(c => `<li>${c.name}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (quote.event_description) {
    html += `
      <div style="margin: 1rem 0;">
        <h3>About Their Event</h3>
        <p>${quote.event_description}</p>
      </div>
    `;
  }

  if (quote.message) {
    html += `
      <div style="margin: 1rem 0;">
        <h3>Customer Message</h3>
        <p>${quote.message}</p>
      </div>
    `;
  }

  html += `
      <div style="background: #f5f5f5; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
        <p><small>Submitted via humblechef.com quote form</small></p>
      </div>
    </div>
  `;

  return html;
}

function buildCustomerEmailHTML(name, tier, selectedCombos, calculated) {
  return `
    <div style="font-family: Montserrat, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2340;">Your Humble Chef Quote Request Has Been Received</h2>
      <p>Hi ${name},</p>
      <p>Thank you for reaching out to Humble Chef! We've received your quote request and Brian will be in touch within 1–2 business days.</p>
      <div style="background: #f5f5f5; padding: 1rem; border-radius: 0.5rem; margin: 1.5rem 0;">
        <h3 style="margin-top: 0;">Your Selections</h3>
        <p><strong>Option:</strong> ${tier.name}</p>
        ${calculated.showPrice ? `<p><strong>Estimated Total:</strong> $${calculated.totalLow}–$${calculated.totalHigh}</p>` : '<p><strong>We\'ll provide custom pricing</strong> based on your specific needs.</p>'}
      </div>
      <div style="margin: 1rem 0;">
        <p><strong>Contact us directly:</strong></p>
        <p>📞 (903) 484-4470</p>
        <p>📧 humblechefbrian@gmail.com</p>
      </div>
      <p style="color: #999; font-size: 0.9rem;">— The Humble Chef Team</p>
    </div>
  `;
}
