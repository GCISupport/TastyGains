// Quiz Funnel JavaScript - Upgraded Recommendation Engine
(function() {
    'use strict';
    
    let currentQuestion = 1;
    const totalQuestions = 12;
    let answers = {};
    let userProfile = {};

    function initQuiz() {
        updateProgress();
        updateNavigationState();
    }

    document.addEventListener('click', function(e) {
        if (e.target.closest('.option')) {
            const option = e.target.closest('.option');
            const question = option.closest('.question');
            const questionNum = parseInt(question.dataset.question);
            const value = option.dataset.value;

            question.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });

            option.classList.add('selected');
            answers['q' + questionNum] = value;
            updateUserProfile(questionNum, value);
            document.getElementById('nextBtn').disabled = false;
            
            // Instant auto-advance - no delay
            if (currentQuestion < totalQuestions) {
                nextQuestion();
            } else {
                showResults();
            }
        }
    });

    function updateUserProfile(questionNum, value) {
        switch(questionNum) {
            case 1:
                userProfile.experience = value;
                break;
            case 2:
                userProfile.primaryGoal = value;
                break;
            case 3:
                userProfile.challenge = value;
                break;
            case 4:
                userProfile.workoutFreq = value;
                break;
            case 5:
                userProfile.timing = value;
                break;
            case 6:
                userProfile.varietyPreference = value; // Updated for variety bonus logic
                break;
            case 7:
                userProfile.priority = value;
                break;
            case 8:
                userProfile.timeline = value;
                break;
            case 9:
                userProfile.currentSupps = value;
                break;
            case 10:
                userProfile.budget = value;
                break;
            case 11:
                userProfile.commitment = value;
                break;
            case 12:
                userProfile.bonus = value;
                break;
        }
    }

    function nextQuestion() {
        if (currentQuestion < totalQuestions) {
            document.querySelector('[data-question="' + currentQuestion + '"]').classList.remove('active');
            currentQuestion++;
            
            if (currentQuestion <= totalQuestions) {
                const nextQ = document.querySelector('[data-question="' + currentQuestion + '"]');
                if (nextQ) {
                    // Instant transition - no delays
                    updateProgress();
                    updateNavigationState();
                    nextQ.classList.add('active');
                } else {
                    showResults();
                }
            } else {
                showResults();
            }
        } else {
            showResults();
        }
    }

    function previousQuestion() {
        if (currentQuestion > 1) {
            document.querySelector('[data-question="' + currentQuestion + '"]').classList.remove('active');
            currentQuestion--;
            document.querySelector('[data-question="' + currentQuestion + '"]').classList.add('active');
            updateProgress();
            updateNavigationState();
        }
    }

    function updateProgress() {
        const progress = (currentQuestion / totalQuestions) * 100;
        document.getElementById('progressBar').style.width = progress + '%';
        
        // Update question counter
        document.getElementById('questionCounter').textContent = `Question ${currentQuestion} of ${totalQuestions}`;
        
        let progressMessage = '';
        if (currentQuestion <= 4) {
            progressMessage = "Getting to know your goals...";
        } else if (currentQuestion <= 8) {
            progressMessage = "Optimizing your recommendations...";
        } else {
            progressMessage = "Finalizing your perfect stack...";
        }
        
        document.getElementById('progressText').textContent = progressMessage;
    }

    function updateNavigationState() {
        const backBtn = document.getElementById('backBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (currentQuestion > 1) {
            backBtn.style.display = 'block';
        } else {
            backBtn.style.display = 'none';
        }
        
        const isAnswered = answers['q' + currentQuestion] !== undefined;
        nextBtn.disabled = !isAnswered;
    }

    function showResults() {
        document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
        document.getElementById('navButtons').style.display = 'none';
        
        // Keep the logo visible but hide the quiz title/subtitle
        document.querySelector('.quiz-title').style.display = 'none';
        document.querySelector('.quiz-subtitle').style.display = 'none';
        
        // Generate personalized stack recommendation
        generatePersonalizedStack();
        
        // Add educational content to results page
        addResultsEducation();
        
        document.getElementById('results').classList.add('active');
    }

    function generatePersonalizedStack() {
        const cartData = getDynamicCartData();
        
        // Update stack name and description with advanced recommendations
        document.getElementById('stackName').textContent = cartData.stackName;
        document.getElementById('stackDescription').textContent = cartData.description;
        
        // Update features list with dynamic products
        updateFeaturesList(cartData);
        
        // Update pricing with dynamic pricing
        updatePricing(cartData);
        
        // Add upgrade messaging if available
        if (cartData.upgradeMessage) {
            const upgradeDiv = document.createElement('div');
            upgradeDiv.className = 'upgrade-message';
            upgradeDiv.innerHTML = '<strong>💡 Pro Tip:</strong> ' + cartData.upgradeMessage;
            
            const stackDescription = document.getElementById('stackDescription');
            stackDescription.parentNode.insertBefore(upgradeDiv, stackDescription.nextSibling);
        }
    }

    function updateFeaturesList(cartData) {
        const featuresList = document.getElementById('featuresList');
        featuresList.innerHTML = '';
        
        cartData.products.forEach(product => {
            const featureItem = document.createElement('div');
            featureItem.className = 'feature-item';
            featureItem.innerHTML = `
                <div class="icon">✓</div>
                <span>${product.name}</span>
            `;
            featuresList.appendChild(featureItem);
        });
    }

    function updatePricing(cartData) {
        document.getElementById('priceText').textContent = cartData.priceText;
        document.getElementById('savingsText').textContent = cartData.savingsText;
        document.getElementById('offerBadge').textContent = cartData.offerBadge;
        document.getElementById('urgencyText').innerHTML = cartData.urgencyText;
    }

    function addResultsEducation() {
        const educationContainer = document.getElementById('resultsEducation');
        educationContainer.innerHTML = ''; // Clear any existing content
        
        // Create educational content based on user's primary answers
        const educationContent = generateEducationalContent();
        const socialContent = generateSocialContent();
        
        educationContent.forEach(content => {
            const tip = document.createElement('div');
            tip.className = 'education-tip';
            tip.innerHTML = '<h4>' + content.title + '</h4><p>' + content.text + '</p>';
            educationContainer.appendChild(tip);
        });
        
        socialContent.forEach(content => {
            const proof = document.createElement('div');
            proof.className = 'social-proof';
            proof.innerHTML = '<p>✨ ' + content + '</p>';
            educationContainer.appendChild(proof);
        });
    }

    function generateEducationalContent() {
        const content = [];
        
        // Based on primary goal
        if (userProfile.primaryGoal === 'muscle') {
            content.push({
                title: "💪 Muscle Building Science",
                text: "Our creatine increases protein synthesis by 15-22%. Combined with pre-workout, users gain 3-5 lbs more muscle in 8 weeks."
            });
        } else if (userProfile.primaryGoal === 'focus') {
            content.push({
                title: "🧠 Cognitive Enhancement",
                text: "Our nootropic blend increases focus by 67% within 30 minutes. Perfect for both mental and physical performance."
            });
        } else if (userProfile.primaryGoal === 'strength') {
            content.push({
                title: "🏋️ Power Amplification",
                text: "Strength athletes report 15-25% max lift increases in 4 weeks. Our combination maximizes explosive power output."
            });
        } else if (userProfile.primaryGoal === 'endurance') {
            content.push({
                title: "🏃 Endurance Revolution",
                text: "Marathon runners extend their sessions by 20-30 minutes. Our formula prevents fatigue cascade and maintains peak performance."
            });
        } else {
            content.push({
                title: "🌟 Holistic Wellness",
                text: "Complete wellness users report improved energy, enhanced sleep quality, and elevated daily performance within 2 weeks."
            });
        }
        
        // Based on experience level
        if (userProfile.experience === 'new') {
            content.push({
                title: "🌱 Perfect Starting Point",
                text: "New users see 40% faster results with our guided approach. We'll recommend the optimal starter stack and provide step-by-step guidance."
            });
        } else if (userProfile.experience === 'experienced') {
            content.push({
                title: "🚀 Advanced Optimization",
                text: "Experienced users unlock our premium formulations and advanced protocols. Time to break through your next level."
            });
        }
        
        // Based on commitment level
        if (userProfile.commitment === 'transformation') {
            content.push({
                title: "🔥 Complete Metamorphosis",
                text: "Long-term commitment unlocks our most powerful transformation protocols. All-in users see 2-3x more dramatic results."
            });
        }
        
        return content;
    }

    function generateSocialContent() {
        const content = [];
        
        if (userProfile.primaryGoal === 'muscle') {
            content.push("87% of muscle builders see visible gains within 4-6 weeks");
        } else if (userProfile.primaryGoal === 'focus') {
            content.push("94% report improved mental clarity within the first week");
        } else if (userProfile.primaryGoal === 'strength') {
            content.push("Strength-focused users increase max lifts by average 18% in 6 weeks");
        } else if (userProfile.primaryGoal === 'endurance') {
            content.push("Endurance athletes extend workout duration by 25-35% on average");
        } else {
            content.push("Wellness-focused users report improved energy in 92% of cases");
        }
        
        if (userProfile.experience === 'new') {
            content.push("95% of new users stick with their supplement routine using our guidance");
        } else if (userProfile.experience === 'experienced') {
            content.push("Advanced users report 40% faster optimization with our premium stacks");
        }
        
        if (userProfile.commitment === 'transformation') {
            content.push("Long-term commitment users report 3x more dramatic body changes");
        }
        
        return content;
    }

    // UPGRADED RECOMMENDATION ENGINE
    function getDynamicCartData() {
        // Calculate comprehensive user score
        const userScore = calculateUserScore();
        const varietyBonus = calculateVarietyBonus();
        
        // Get personalized recommendation
        const recommendation = getSmartRecommendation(userScore, varietyBonus);
        
        console.log('User Score:', userScore);
        console.log('Variety Bonus Score:', varietyBonus);
        console.log('Recommendation:', recommendation);
        
        return recommendation;
    }

    function calculateUserScore() {
        let score = 0;
        
        // Activity Level Score (0-20 points)
        switch(userProfile.workoutFreq) {
            case '1-2days': score += 5; break;
            case '3-4days': score += 12; break;
            case '5-6days': score += 18; break;
            case 'daily': score += 20; break;
        }
        
        // Commitment Score (0-25 points)
        switch(userProfile.commitment) {
            case 'trial': score += 8; break;
            case 'committed': score += 18; break;
            case 'transformation': score += 25; break;
        }
        
        // Budget Score (0-20 points)
        switch(userProfile.budget) {
            case 'budget': score += 8; break;
            case 'moderate': score += 15; break;
            case 'premium': score += 20; break;
            case 'no_limit': score += 20; break;
        }
        
        // Experience Score (0-15 points)
        switch(userProfile.experience) {
            case 'new': score += 5; break;
            case 'some': score += 10; break;
            case 'experienced': score += 15; break;
        }
        
        // Goal Intensity Score (0-20 points)
        switch(userProfile.primaryGoal) {
            case 'general': score += 8; break;
            case 'focus': score += 10; break;
            case 'endurance': score += 15; break;
            case 'muscle': score += 18; break;
            case 'strength': score += 18; break;
        }
        
        return score;
    }

    function calculateVarietyBonus() {
        let varietyScore = 0;
        
        // Question 6: Variety preference (0-3 points)
        switch(userProfile.varietyPreference) {
            case 'variety': varietyScore += 3; break;
            case 'surprise': varietyScore += 3; break;
            case 'rotation': varietyScore += 2; break;
            case 'simple': varietyScore += 0; break;
        }
        
        // Question 7: Complete experience priority (0-2 points)
        if (userProfile.priority === 'complete') {
            varietyScore += 2;
        }
        
        // Question 8: Long-term timeline supports variety (0-2 points)
        if (userProfile.timeline === 'longterm') {
            varietyScore += 2;
        }
        
        // Question 12: Flavor discovery interest (0-3 points)
        if (userProfile.bonus === 'flavor_discovery') {
            varietyScore += 3;
        }
        
        return varietyScore;
    }

    function getSmartRecommendation(score, varietyBonus) {
        const budget = userProfile.budget;
        const activity = userProfile.workoutFreq;
        const commitment = userProfile.commitment;
        const goal = userProfile.primaryGoal;
        
        // Determine base recommendation based on score ranges
        let recommendation = {};
        
        if (score <= 35) {
            // Low Score: Conservative recommendations
            if (activity === '1-2days' || goal === 'focus') {
                recommendation = {
                    type: 'single_nootropics',
                    duration: 1,
                    subscription: true,
                    price: 24,
                    stackName: 'Wellness Warrior Starter Stack',
                    description: 'Perfect starting point for building healthy habits. Our nootropics provide the mental clarity and motivation to establish a consistent routine.',
                    upgradeMessage: 'Once you experience improved focus and motivation, consider adding our creatine gummies for complete physical + mental synergy.',
                    products: [
                        { name: 'Work Vibes Nootropic Capsules (Monthly)', id: 'nootropic_monthly' }
                    ],
                    priceText: 'Monthly Subscription - $24.00/month',
                    savingsText: 'YOU SAVE $6.00 per month vs one-time pricing ($30.00)',
                    offerBadge: 'STARTER SPECIAL',
                    urgencyText: '🌱 Perfect for beginners - Start your journey today!'
                };
            } else {
                recommendation = {
                    type: 'single_creatine',
                    duration: 1,
                    subscription: true,
                    price: 25,
                    stackName: 'Strength Master Starter Stack',
                    description: 'Foundation-building stack focused on strength and recovery. Start with proven creatine science to see immediate performance gains.',
                    upgradeMessage: 'After 30 days of strength gains, most users add our nootropics for complete mind-muscle optimization.',
                    products: [
                        { name: 'Creatine Gummies - Blue Raspberry (Monthly)', id: 'creatine_monthly' }
                    ],
                    priceText: 'Monthly Subscription - $25.00/month',
                    savingsText: 'YOU SAVE $5.00 per month vs one-time pricing ($30.00)',
                    offerBadge: 'STRENGTH STARTER',
                    urgencyText: '💪 Build strength from day one!'
                };
            }
        } else if (score <= 55) {
            // Medium Score: Balanced recommendations
            if (budget === 'budget') {
                recommendation = {
                    type: 'both_products',
                    duration: 1,
                    subscription: true,
                    price: 49,
                    stackName: 'Performance Synergy Essential Stack',
                    description: 'Complete physical + mental performance system. Get the full synergy effect with both products at our most affordable monthly rate.',
                    upgradeMessage: 'Many users upgrade to 3-month supplies after experiencing the powerful synergy effect - significant savings and consistency.',
                    products: [
                        { name: 'Creatine Gummies - Blue Raspberry (Monthly)', id: 'creatine_monthly' },
                        { name: 'Work Vibes Nootropic Capsules (Monthly)', id: 'nootropic_monthly' }
                    ],
                    priceText: 'Monthly Subscription - $49.00/month',
                    savingsText: 'YOU SAVE $11.00 per month vs one-time pricing ($60.00)',
                    offerBadge: 'BEST VALUE COMBO',
                    urgencyText: '🎯 Complete mind-muscle synergy at the best price!'
                };
            } else {
                recommendation = {
                    type: 'both_products',
                    duration: 2,
                    subscription: true,
                    price: 98,
                    stackName: 'Peak Synergy Pro Stack',
                    description: 'Advanced 2-month supply ensuring consistent results and habit formation. Physical strength + mental clarity working in perfect harmony.',
                    upgradeMessage: 'Pro tip: Users who commit to 3+ months see exponentially better results due to compound effects.',
                    products: [
                        { name: 'Creatine Gummies - Blue Raspberry (2-Month Supply)', id: 'creatine_2month' },
                        { name: 'Work Vibes Nootropic Capsules (2-Month Supply)', id: 'nootropic_2month' }
                    ],
                    priceText: '2-Month Subscription - $98.00 (2 months)',
                    savingsText: 'YOU SAVE $22.00 vs monthly pricing ($120.00)',
                    offerBadge: 'PRO PERFORMANCE',
                    urgencyText: '🚀 2-month commitment = better consistency and results!'
                };
            }
        } else if (score <= 75) {
            // High Score: Premium recommendations
            recommendation = {
                type: 'both_products',
                duration: 3,
                subscription: true,
                price: 147,
                stackName: 'Elite Performance Synergy Stack',
                description: 'Premium 3-month transformation system. Complete physical + mental optimization with our highest-performing dosage protocol.',
                upgradeMessage: 'Elite users often extend to 6-month protocols for maximum body recomposition and cognitive enhancement.',
                products: [
                    { name: 'Creatine Gummies - Blue Raspberry (3-Month Supply)', id: 'creatine_3month' },
                    { name: 'Work Vibes Nootropic Capsules (3-Month Supply)', id: 'nootropic_3month' }
                ],
                priceText: '3-Month Subscription - $147.00 (3 months)',
                savingsText: 'YOU SAVE $33.00 vs monthly pricing ($180.00)',
                offerBadge: 'ELITE TRANSFORMATION',
                urgencyText: '🔥 3-month elite protocol - Maximum results guaranteed!'
            };
        } else {
            // Maximum Score: Ultra-premium recommendations
            recommendation = {
                type: 'both_products',
                duration: 6,
                subscription: true,
                price: 294,
                stackName: 'Ultimate Mind-Muscle Mastery Stack',
                description: 'Ultimate 6-month transformation protocol. Complete system for serious athletes and high-performers seeking maximum results.',
                upgradeMessage: 'You\'re committed to excellence. After this protocol, we\'ll help you design your advanced optimization regimen.',
                products: [
                    { name: 'Creatine Gummies - Blue Raspberry (6-Month Supply)', id: 'creatine_6month' },
                    { name: 'Work Vibes Nootropic Capsules (6-Month Supply)', id: 'nootropic_6month' }
                ],
                priceText: '6-Month Subscription - $294.00 (6 months)',
                savingsText: 'YOU SAVE $66.00 vs monthly pricing ($360.00)',
                offerBadge: 'ULTIMATE MASTERY',
                urgencyText: '👑 6-month mastery protocol - For the truly committed!'
            };
        }
        
        // Apply variety bonus logic
        if (varietyBonus >= 6 && (budget === 'premium' || budget === 'no_limit')) {
            recommendation.varietyBonus = true;
            recommendation.description += ' BONUS: 3-flavor creatine variety pack included for complete taste exploration.';
            recommendation.stackName = recommendation.stackName.replace('Stack', 'Discovery Stack');
            if (recommendation.products.length > 0) {
                recommendation.products[0].name = recommendation.products[0].name.replace('Blue Raspberry', 'Variety Pack (3 Flavors)');
            }
        }
        
        // Generate cart URL
        recommendation.cartUrl = generateCartUrl(recommendation);
        
        return recommendation;
    }

    function generateCartUrl(recommendation) {
        // Base Shopify cart URL
        let baseUrl = window.quizConfig ? window.quizConfig.cartUrl : '/cart';
        
        // For now, return a placeholder URL that can be updated when product IDs are available
        return baseUrl + '?note=Quiz+Recommendation:+' + encodeURIComponent(recommendation.stackName);
    }

    // Global functions for buttons
    window.claimOffer = function() {
        // Get dynamic recommendation with advanced weighting
        const cartData = getDynamicCartData();
        
        console.log('Quiz answers:', answers);
        console.log('User profile:', userProfile);
        console.log('Personalized recommendation:', cartData);
        console.log('Redirecting to cart:', cartData.cartUrl);
        
        window.open(cartData.cartUrl, '_blank');
    };

    window.retakeQuiz = function() {
        currentQuestion = 1;
        answers = {};
        userProfile = {};
        
        // Show quiz title and subtitle again for retake
        document.querySelector('.quiz-title').style.display = 'block';
        document.querySelector('.quiz-subtitle').style.display = 'block';
        
        document.querySelectorAll('.option.selected').forEach(option => {
            option.classList.remove('selected');
        });
        
        document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
        document.getElementById('results').classList.remove('active');
        
        document.getElementById('navButtons').style.display = 'flex';
        document.querySelector('[data-question="1"]').classList.add('active');
        
        updateProgress();
        updateNavigationState();
        
        console.log('Quiz retaken - reset to question 1');
    };

    window.nextQuestion = nextQuestion;
    window.previousQuestion = previousQuestion;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initQuiz();
        });
    } else {
        initQuiz();
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !document.getElementById('nextBtn').disabled) {
            nextQuestion();
        } else if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
            if (currentQuestion > 1) {
                previousQuestion();
            }
        }
    });

    console.log('Quiz Analytics: quiz_started', { timestamp: new Date() });
})();