package hu.schbme.paybasz.station.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Value("${paybasz.admin.username:admin}")
	private String adminUsername;

	@Value("${paybasz.admin.password:1234}")
	private String adminPassword;


	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http
				.httpBasic(Customizer.withDefaults())
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/admin/**").hasRole("ADMIN")
						.requestMatchers("/api/**", "/api/v2/**", "/images/**", "/logout", "/login", "/login-error", "/**").permitAll()
				)
				.formLogin(form -> form
						.loginPage("/login")
						.failureUrl("/login-error")
						.defaultSuccessUrl("/admin/", true)
				)
				.logout(logout -> logout.logoutSuccessUrl("/login"))
				.cors(cors -> cors.configurationSource(request -> new CorsConfiguration().applyPermitDefaultValues()))
				.csrf(AbstractHttpConfigurer::disable)
				.build();
	}

	@Bean
	public InMemoryUserDetailsManager userDetailsService() {
		UserDetails user = User.withUsername(adminUsername)
				.password("{noop}" + adminPassword)
				.roles("ADMIN")
				.build();

		return new InMemoryUserDetailsManager(user);
	}
}