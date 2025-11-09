/**
 * IZZAD.STUDIO - PHILOSOPHY GALLERY MODULE
 * Text-driven, hover-reveal interaction design
 */

(function() {
    'use strict';

    // ==========================================
    // PHILOSOPHY DATA
    // ==========================================
    
    /**
     * Philosophy-driven gallery structure
     * Users interact with beliefs, not service lists
     */
    const philosophyData = [
        {
            id: 'listen',
            statement: 'we listen before we design',
            philosophy: 'most designers start with trends. we start with conversation.',
            services: ['consultation', 'brand strategy', 'art direction'],
            work: [
                {
                    client: 'craft coffee roastery',
                    approach: 'spent 3 weeks learning their process before touching design',
                    image: '/assets/work/consultation/coffee-discovery.jpg',
                    deliverables: 'brand foundation, visual language, story framework'
                },
                {
                    client: 'wellness tech startup',
                    approach: 'interviewed their users, not just the founders',
                    image: '/assets/work/consultation/wellness-research.jpg',
                    deliverables: 'positioning strategy, brand architecture'
                }
            ]
        },
        {
            id: 'identity',
            statement: 'logos are just the beginning',
            philosophy: 'identity is language. we teach brands how to speak.',
            services: ['brand identity', 'visual systems', 'guidelines'],
            work: [
                {
                    client: 'fintech disruptor',
                    approach: 'built a system that whispers luxury',
                    image: '/assets/work/identity/fintech-system.jpg',
                    deliverables: 'logo, typography, color system, 60pg guidelines'
                },
                {
                    client: 'fashion designer',
                    approach: 'translated fabric into visual voice',
                    image: '/assets/work/identity/fashion-identity.jpg',
                    deliverables: 'complete brand identity, lookbook templates'
                },
                {
                    client: 'architecture firm',
                    approach: 'minimalism that demands attention',
                    image: '/assets/work/identity/architecture-brand.jpg',
                    deliverables: 'brand identity, stationery, presentation system'
                }
            ]
        },
        {
            id: 'packaging',
            statement: 'the box sells before the product',
            philosophy: 'packaging is the first handshake. we make it memorable.',
            services: ['product packaging', 'label design', 'unboxing experience'],
            work: [
                {
                    client: 'craft brewery',
                    approach: 'local roots, global shelf presence',
                    image: '/assets/work/packaging/beer-labels.jpg',
                    deliverables: 'can design, 6-pack system, seasonal editions'
                },
                {
                    client: 'skincare line',
                    approach: 'minimal packaging that feels luxe',
                    image: '/assets/work/packaging/skincare-boxes.jpg',
                    deliverables: 'bottle design, box structure, tissue paper details'
                }
            ]
        },
        {
            id: 'digital',
            statement: 'feeds should feel like galleries',
            philosophy: 'social media is art space. we curate, not clutter.',
            services: ['social media design', 'digital content', 'templates'],
            work: [
                {
                    client: 'fashion boutique',
                    approach: 'instagram as editorial magazine',
                    image: '/assets/work/digital/fashion-feed.jpg',
                    deliverables: 'post templates, story highlights, reels framework'
                },
                {
                    client: 'coffee brand',
                    approach: 'every post tells the origin story',
                    image: '/assets/work/digital/coffee-social.jpg',
                    deliverables: 'content system, 3-month visual calendar'
                }
            ]
        },
        {
            id: 'collateral',
            statement: 'from banners to business cards',
            philosophy: 'every touchpoint is a brand moment. we design them all.',
            services: ['marketing materials', 'print collateral', 'environmental'],
            work: [
                {
                    client: 'tech conference',
                    approach: 'banners that stop scrolling thumbs',
                    image: '/assets/work/collateral/conference-banners.jpg',
                    deliverables: 'banners, buntings, signage, badges'
                },
                {
                    client: 'retail flagship',
                    approach: 'storefront that becomes landmark',
                    image: '/assets/work/collateral/retail-signage.jpg',
                    deliverables: 'window graphics, in-store posters, shopping bags'
                }
            ]
        },
        {
            id: 'profiles',
            statement: 'first impressions in print',
            philosophy: 'company profiles are visual novels. we write them in design.',
            services: ['company profiles', 'brochures', 'pitch decks'],
            work: [
                {
                    client: 'architecture studio',
                    approach: 'profile that mirrors their buildings',
                    image: '/assets/work/profiles/architecture-profile.jpg',
                    deliverables: '32pg company profile, case study layouts'
                },
                {
                    client: 'investment firm',
                    approach: 'trust through typography',
                    image: '/assets/work/profiles/investment-brochure.jpg',
                    deliverables: 'annual report, investor deck, capability statement'
                }
            ]
        }
    ];

    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    
    let state = {
        activePhilosophy: null,
        isInitialized: false
    };

    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    
    const elements = {
        philosophyList: document.getElementById('philosophyList')
    };

    // ==========================================
    // INITIALIZATION
    // ==========================================
    
    /**
     * Initialize philosophy gallery
     */
    function init() {
        if (!elements.philosophyList) {
            console.warn('Philosophy list element not found');
            return;
        }
        
        renderPhilosophyGallery();
        state.isInitialized = true;
        console.log('🎨 philosophy gallery initialized');
    }

    // ==========================================
    // RENDERING
    // ==========================================
    
    /**
     * Render philosophy-driven gallery
     */
    function renderPhilosophyGallery() {
        const html = philosophyData.map(philosophy => {
            const workItems = philosophy.work.map(workItem => `
                <div class="work-item">
                    <div class="work-item__image-wrapper">
                        <img 
                            src="${workItem.image}" 
                            alt="${workItem.client} - ${workItem.approach}"
                            class="work-item__image"
                            loading="lazy"
                        >
                    </div>
                    <div class="work-item__info">
                        <p class="work-item__client">${workItem.client}</p>
                        <p class="work-item__approach">${workItem.approach}</p>
                        <p class="work-item__deliverables">${workItem.deliverables}</p>
                    </div>
                </div>
            `).join('');

            return `
                <div class="philosophy-item" data-philosophy="${philosophy.id}">
                    <h3 class="philosophy-item__statement">${philosophy.statement}</h3>
                    <p class="philosophy-item__philosophy">${philosophy.philosophy}</p>
                    <p class="philosophy-item__services">${philosophy.services.join(' • ')}</p>
                    <div class="philosophy-item__work">
                        ${workItems}
                    </div>
                </div>
            `;
        }).join('');

        elements.philosophyList.innerHTML = html;
    }

    // ==========================================
    // PUBLIC API
    // ==========================================
    
    window.IzzadGallery = {
        init,
        data: philosophyData
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
