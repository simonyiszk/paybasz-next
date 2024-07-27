package hu.schbme.paybasz.station.repo;

import hu.schbme.paybasz.station.model.ItemTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface ItemTokenRepository extends JpaRepository<ItemTokenEntity, Long> {

	@Query("select i from ItemTokenEntity i where i.userId = ?1 and i.itemId = ?2")
	Optional<ItemTokenEntity> findItemToken(Long userId, Long itemId);

	@Modifying
	@Transactional
	@Query("update ItemTokenEntity i set i.count = (i.count + ?3) where i.userId = ?1 and i.itemId = ?2")
	void updateItemTokenCount(Long userId, Long itemId, Integer amount);

	@Modifying
	@Transactional
	@Query("delete from ItemTokenEntity i where i.userId = ?1 and i.itemId = ?2")
	int deleteItemToken(Long userId, Long itemId);

}
