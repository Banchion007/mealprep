import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { animate } from 'motion'
import { Helmet } from 'react-helmet-async'
import { TIERS, BREAKFAST_OPTIONS } from '../data/menuData'
import { calculateQuoteRange, formatCurrency, formatRange } from '../utils/quoteCalculations'
import { supabase } from '../lib/supabase'
import { sendEmailViaResend } from '../lib/resendEmail'
import { pageMetadata, getCanonicalUrl, SITE_NAME, DEFAULT_OG_IMAGE, getSchemaOrgData } from '../lib/seo'
import './QuotePage.css'

const STEPS = ['Your Event', 'Choose Tier', 'Build Your Menu', 'Add-Ons', 'Your Info', 'Review & Submit'];
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

function Step1EventDetails({ data, onChange, onNext }) {
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

        <button
          className="quote-form__btn quote-form__btn--primary"
          onClick={onNext}
          disabled={!canProceed}
        >
          Next: Choose Your Tier
        </button>
      </div>
    </StepTransition>
  );
}

function TierCard({ tier, isSelected, onSelect }) {
  const isPremium = tier.id >= 6;
  const isCustom = tier.id === 8;

  return (
    <div
      className={`tier-card${tier.id === 7 ? ' tier-card--opulence' : tier.id === 6 ? ' tier-card--elegance' : isCustom ? ' tier-card--custom' : ''}${isSelected ? ' selected' : ''}`}
      onClick={onSelect}
    >
      {tier.id === 7 && <div className="tier-card__badge">Most Premium</div>}
      {tier.id === 6 && <div className="tier-card__badge">Popular for Events</div>}
      {isCustom && <div className="tier-card__badge">Design It Your Way</div>}

      <div className="tier-card__header">
        <h3 className="tier-card__name">{tier.name}</h3>
        <p className="tier-card__tagline">{tier.tagline}</p>
      </div>

      {!isCustom && (
        <div className="tier-card__price">
          <span className="tier-card__price-text">${tier.pricePerPersonLow}–${tier.pricePerPersonHigh}</span>
          <span className="tier-card__price-label">per person</span>
        </div>
      )}

      {isCustom && (
        <div className="tier-card__price tier-card__price--custom">
          <p className="tier-card__custom-text">{tier.serviceStyle}</p>
        </div>
      )}

      {!isCustom && (
        <div className="tier-card__details">
          <p className="tier-card__minimum">
            {tier.guestMinimum ? `Minimum ${tier.guestMinimum} guests` : 'No minimum'}
          </p>
        </div>
      )}

      <div className="tier-card__highlights">
        {tier.highlights.slice(0, isPremium || isCustom ? 5 : 3).map((h, i) => (
          <div key={i} className="tier-card__highlight">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>{h}</span>
          </div>
        ))}
      </div>

      <button className="tier-card__btn">
        {isSelected ? '✓ Selected' : 'Select This Tier'}
      </button>
    </div>
  );
}

function Step2ChooseTier({ selectedTierId, onSelect, onNext, onJumpToStep }) {
  const handleSelect = (tierId) => {
    onSelect(tierId);
    const tier = TIERS.find(t => t.id === tierId);
    if (tier && tier.id === 8) {
      setTimeout(() => onJumpToStep(4), 400);
    } else {
      setTimeout(onNext, 400);
    }
  };

  const sortedTiers = [...TIERS].reverse();

  return (
    <StepTransition step={2}>
      <h2 className="quote-step__title">Choose Your Tier</h2>
      <div className="tiers-grid">
        {sortedTiers.map(tier => (
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

function Step3BuildMenu({ selectedTierId, selections, onSelectItem, addBreakfast, breakfastSelected }) {
  const tier = TIERS.find(t => t.id === selectedTierId);
  if (!tier) return null;

  const courseKeys = Object.keys(tier.courses);

  return (
    <StepTransition step={3}>
      <h2 className="quote-step__title">Build Your Menu</h2>

      <div className="menu-builder">
        {courseKeys.map(courseKey => {
          const course = tier.courses[courseKey];
          const selected = selections[courseKey] || [];

          return (
            <div key={courseKey} className="menu-course">
              <div className="menu-course__header">
                <h3 className="menu-course__title">{course.label}</h3>
                <p className="menu-course__limit">{course.chooseCount}</p>
              </div>

              <div className="menu-items-grid">
                {course.items.map((item, i) => (
                  <label key={i} className="menu-item">
                    <input
                      type="checkbox"
                      checked={selected.includes(item)}
                      onChange={e => {
                        if (e.target.checked) {
                          onSelectItem(courseKey, [...selected, item]);
                        } else {
                          onSelectItem(courseKey, selected.filter(s => s !== item));
                        }
                      }}
                    />
                    <span className="menu-item__label">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}

        <div className="menu-breakfast">
          <h3 className="menu-breakfast__title">Add Breakfast Items?</h3>
          <label className="menu-breakfast__toggle">
            <input
              type="checkbox"
              checked={breakfastSelected}
              onChange={e => addBreakfast(e.target.checked)}
            />
            <span>Include breakfast options</span>
          </label>

          {breakfastSelected && (
            <div className="menu-breakfast__options">
              {BREAKFAST_OPTIONS.filter(b => b.availableTiers.includes(selectedTierId)).map(option => (
                <div key={option.id} className="breakfast-option">
                  <strong>{option.name}</strong>
                  <p>{option.description}</p>
                  <small>{option.serviceNote}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StepTransition>
  );
}

function Step4AddOns({ selectedTierId, upgrades, onToggleUpgrade }) {
  const tier = TIERS.find(t => t.id === selectedTierId);
  if (!tier || !tier.availableUpgrades.length) return null;

  return (
    <StepTransition step={4}>
      <h2 className="quote-step__title">Add-Ons & Upgrades</h2>

      <div className="upgrades-list">
        {tier.availableUpgrades.map(upgrade => {
          const isSelected = upgrades.some(u => u.id === upgrade.id);

          return (
            <div key={upgrade.id} className={`upgrade-card${isSelected ? ' selected' : ''}`}>
              <div className="upgrade-card__left">
                <label className="upgrade-card__checkbox">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleUpgrade(upgrade)}
                  />
                  <span className="checkmark" />
                </label>
                <div className="upgrade-card__info">
                  <h4 className="upgrade-card__name">{upgrade.name}</h4>
                  <div className="upgrade-card__meta">
                    <span className="upgrade-card__type">{upgrade.type === 'protein' ? 'Protein' : 'Service'}</span>
                    {upgrade.unit && <span className="upgrade-card__unit">{upgrade.unit}</span>}
                  </div>
                </div>
              </div>
              <div className="upgrade-card__price">
                ${upgrade.priceAddLow}–${upgrade.priceAddHigh}
              </div>
            </div>
          );
        })}
      </div>
    </StepTransition>
  );
}

function Step5YourInfo({ formData, onChange, errors }) {
  return (
    <StepTransition step={5}>
      <h2 className="quote-step__title">Your Information</h2>

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
      </div>
    </StepTransition>
  );
}

function ReviewSummary({ tier, selections, upgrades, guestCountMin, guestCountMax, formData, calculated }) {
  return (
    <div className="review-summary">
      <div className="review-summary__section">
        <h4>Tier & Pricing</h4>
        <p><strong>{tier.name}</strong> · ${tier.pricePerPersonLow}–${tier.pricePerPersonHigh}/person</p>
      </div>

      <div className="review-summary__section">
        <h4>Guests</h4>
        <p>{guestCountMin}–{guestCountMax} guests</p>
      </div>

      <div className="review-summary__section">
        <h4>Estimated Total</h4>
        <p className="review-summary__total">{formatRange(calculated.totalLow, calculated.totalHigh)}</p>
      </div>

      {upgrades.length > 0 && (
        <div className="review-summary__section">
          <h4>{upgrades.length} Add-On{upgrades.length !== 1 ? 's' : ''}</h4>
          <ul>
            {upgrades.map((u, i) => <li key={i}>{u.name}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function Step6ReviewSubmit({ tier, selections, upgrades, guestCountMin, guestCountMax, formData, calculated, onSubmit, isSubmitting, submitError }) {
  return (
    <StepTransition step={6}>
      <h2 className="quote-step__title">Review & Submit</h2>

      <div className="review-container">
        <div className="review-main">
          <section className="review-section">
            <h3>Event Details</h3>
            <div className="review-detail">
              <span className="review-detail__label">Event Type:</span>
              <span>{selections.eventType || '—'}</span>
            </div>
            <div className="review-detail">
              <span className="review-detail__label">Date:</span>
              <span>{selections.eventDate || '(Not specified)'}</span>
            </div>
            <div className="review-detail">
              <span className="review-detail__label">Guests:</span>
              <span>{guestCountMin}–{guestCountMax}</span>
            </div>
          </section>

          <section className="review-section">
            <h3>Selected Tier</h3>
            <div className="review-detail">
              <span className="review-detail__label">{tier.name}</span>
              <span>${tier.pricePerPersonLow}–${tier.pricePerPersonHigh}/person</span>
            </div>
            <p className="review-section__desc">{tier.serviceStyle}</p>
          </section>

          <section className="review-section">
            <h3>Your Menu</h3>
            {Object.entries(selections)
              .filter(([k]) => !['eventType', 'eventDate'].includes(k))
              .map(([courseKey, items]) => {
                if (!items || !items.length) return null;
                return (
                  <div key={courseKey} className="review-course">
                    <h4>{courseKey.replace(/([A-Z])/g, ' $1').trim()}</h4>
                    <ul>
                      {items.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                );
              })}
          </section>

          {upgrades.length > 0 && (
            <section className="review-section">
              <h3>Add-Ons</h3>
              <ul>
                {upgrades.map((u, i) => (
                  <li key={i}>{u.name} ({u.type})</li>
                ))}
              </ul>
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

          <div className="review-disclaimer">
            <p>This is an estimate based on your selections. Final pricing will be confirmed by Humble Chef after reviewing your request.</p>
          </div>

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
            selections={selections}
            upgrades={upgrades}
            guestCountMin={guestCountMin}
            guestCountMax={guestCountMax}
            formData={formData}
            calculated={calculated}
          />
        </aside>
      </div>
    </StepTransition>
  );
}

function ConfirmationScreen({ formData }) {
  return (
    <StepTransition step={7}>
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
            onClick={() => window.location.reload()}
          >
            Start a New Quote
          </button>
        </div>
      </div>
    </StepTransition>
  );
}

export default function QuotePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTierId, setSelectedTierId] = useState(null);
  const [selections, setSelections] = useState({});
  const [upgrades, setUpgrades] = useState([]);
  const [breakfastSelected, setBreakfastSelected] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [eventData, setEventData] = useState({ guestCountMin: null, guestCountMax: null, eventType: '', eventDate: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const tier = selectedTierId ? TIERS.find(t => t.id === selectedTierId) : null;
  const calculated = tier ? calculateQuoteRange(tier, upgrades, eventData.guestCountMin, eventData.guestCountMax) : null;

  const handleNext = useCallback(() => {
    let stepErrors = {};

    if (currentStep === 0) {
      if (!eventData.guestCountMin || eventData.guestCountMin < 1) stepErrors.guestCountMin = 'Minimum guests required';
      if (!eventData.guestCountMax || eventData.guestCountMax < eventData.guestCountMin) stepErrors.guestCountMax = 'Max must be >= min';
    }

    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, eventData]);

  const handleSelectItem = useCallback((courseKey, items) => {
    setSelections(prev => ({ ...prev, [courseKey]: items }));
  }, []);

  const handleToggleUpgrade = useCallback((upgrade) => {
    setUpgrades(prev => {
      const exists = prev.find(u => u.id === upgrade.id);
      if (exists) return prev.filter(u => u.id !== upgrade.id);
      return [...prev, upgrade];
    });
  }, []);

  const validateStep5 = () => {
    const stepErrors = {};
    if (!formData.name.trim()) stepErrors.name = 'Name is required';
    if (!formData.email.trim()) stepErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) stepErrors.email = 'Enter a valid email';
    setErrors(stepErrors);
    return !Object.keys(stepErrors).length;
  };

  const handleSubmit = async () => {
    if (!validateStep5()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
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
        selected_items: selections,
        upgrades: upgrades,
        total_low: calculated.totalLow,
        total_high: calculated.totalHigh,
        status: 'new'
      };

      const { error: insertError } = await supabase
        .from('quotes')
        .insert([quotePayload]);

      if (insertError) throw insertError;

      await sendEmailViaResend({
        to: 'humblechefbrian@gmail.com',
        subject: `New Quote Request — ${tier.name} — ${eventData.guestCountMin}–${eventData.guestCountMax} guests — ${formData.name}`,
        html: buildAdminEmailHTML(quotePayload, selections)
      });

      await sendEmailViaResend({
        to: formData.email,
        subject: 'Your Humble Chef Quote Request Has Been Received',
        html: buildCustomerEmailHTML(formData.name, tier, selections, calculated)
      });

      // Redirect to submission confirmation page for Google tracking
      navigate('/quote/submitted');
    } catch (err) {
      console.error('Quote submission error:', err);
      setSubmitError('Something went wrong. Please try again or contact us at humblechefbrian@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const meta = pageMetadata.quote;

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

      <div className="quote-container">
        {currentStep === 0 && (
          <Step1EventDetails
            data={eventData}
            onChange={(updates) => setEventData(prev => ({ ...prev, ...updates }))}
            onNext={handleNext}
          />
        )}

        {currentStep === 1 && (
          <Step2ChooseTier
            selectedTierId={selectedTierId}
            onSelect={setSelectedTierId}
            onNext={() => setCurrentStep(2)}
            onJumpToStep={(step) => setCurrentStep(step)}
          />
        )}

        {currentStep === 2 && tier && (
          <Step3BuildMenu
            selectedTierId={selectedTierId}
            selections={selections}
            onSelectItem={handleSelectItem}
            addBreakfast={setBreakfastSelected}
            breakfastSelected={breakfastSelected}
          />
        )}

        {currentStep === 3 && tier && (
          tier.availableUpgrades.length ? (
            <Step4AddOns
              selectedTierId={selectedTierId}
              upgrades={upgrades}
              onToggleUpgrade={handleToggleUpgrade}
            />
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>This tier includes all features. Proceeding to your information…</p>
              <button
                className="quote-form__btn quote-form__btn--primary"
                onClick={() => setCurrentStep(4)}
                style={{ marginTop: '1rem' }}
              >
                Continue
              </button>
            </div>
          )
        )}

        {currentStep === 4 && (
          <Step5YourInfo
            formData={formData}
            onChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
            errors={errors}
          />
        )}

        {currentStep === 5 && tier && calculated && (
          <Step6ReviewSubmit
            tier={tier}
            selections={selections}
            upgrades={upgrades}
            guestCountMin={eventData.guestCountMin}
            guestCountMax={eventData.guestCountMax}
            formData={formData}
            calculated={calculated}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        )}
      </div>

      <div className="quote-page__navigation">
        <button
          className="quote-form__btn quote-form__btn--outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Back
        </button>

        {currentStep < STEPS.length - 1 && (
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

function buildAdminEmailHTML(quote, selections) {
  return `
    <div style="font-family: Montserrat, sans-serif; max-width: 600px; margin: 0 auto;">
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
        <p><strong>Tier:</strong> ${quote.tier_name}</p>
        <p><strong>Price Range:</strong> $${quote.base_price_low}–$${quote.base_price_high}/person</p>
        <p><strong>Estimated Total:</strong> $${quote.total_low}–$${quote.total_high}</p>
      </div>
      <div style="margin: 1rem 0;">
        <h3>Selected Items</h3>
        ${Object.entries(selections).map(([k, v]) => `<p><strong>${k}:</strong> ${(v || []).join(', ') || 'None'}</p>`).join('')}
      </div>
      ${quote.upgrades.length ? `
        <div style="margin: 1rem 0;">
          <h3>Add-Ons</h3>
          <ul>
            ${quote.upgrades.map(u => `<li>${u.name}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      ${quote.message ? `
        <div style="margin: 1rem 0;">
          <h3>Customer Message</h3>
          <p>${quote.message}</p>
        </div>
      ` : ''}
      <div style="background: #f5f5f5; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
        <p><small>Submitted via humblechef.com quote form</small></p>
      </div>
    </div>
  `;
}

function buildCustomerEmailHTML(name, tier, selections, calculated) {
  return `
    <div style="font-family: Montserrat, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2340;">Your Humble Chef Quote Request Has Been Received</h2>
      <p>Hi ${name},</p>
      <p>Thank you for reaching out to Humble Chef! We've received your quote request and Brian will be in touch within 1–2 business days.</p>
      <div style="background: #f5f5f5; padding: 1rem; border-radius: 0.5rem; margin: 1.5rem 0;">
        <h3 style="margin-top: 0;">Your Selections</h3>
        <p><strong>Tier:</strong> ${tier.name}</p>
        <p><strong>Estimated Total:</strong> $${calculated.totalLow}–$${calculated.totalHigh}</p>
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
